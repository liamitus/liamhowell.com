/**
 * Govroll demo loop
 * Bill slides in -> 50 rep dots cascade-flip green/red -> tally settles.
 */
(function () {
    var BILLS = [
        { id: 'H.R. 4242', title: 'Clean Energy Innovation Act', yeaRate: 0.62 },
        { id: 'S. 1130',   title: 'Small Business Tax Relief',   yeaRate: 0.74 },
        { id: 'H.R. 88',   title: 'Veterans Healthcare Expansion', yeaRate: 0.81 },
        { id: 'S. 2901',   title: 'Federal Research Funding Act', yeaRate: 0.46 },
        { id: 'H.R. 1234', title: 'Public Lands Protection Act',  yeaRate: 0.55 }
    ];

    var ROWS = 5;
    var COLS = 10;
    var TOTAL = ROWS * COLS;

    function setup() {
        var stage = document.getElementById('govroll-stage');
        if (!stage) return;

        var billId = stage.querySelector('[data-gr="bill-id"]');
        var billTitle = stage.querySelector('[data-gr="bill-title"]');
        var grid = stage.querySelector('[data-gr="grid"]');
        var yeaEl = stage.querySelector('[data-gr="yea"]');
        var nayEl = stage.querySelector('[data-gr="nay"]');
        var resultEl = stage.querySelector('[data-gr="result"]');

        // Build grid once.
        for (var i = 0; i < TOTAL; i++) {
            var d = document.createElement('span');
            d.className = 'gr-cell';
            grid.appendChild(d);
        }
        var cells = grid.querySelectorAll('.gr-cell');

        var visible = true;
        var inView = true;
        document.addEventListener('visibilitychange', function () {
            visible = !document.hidden;
        });
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                inView = entries[0] && entries[0].isIntersecting;
            }, { threshold: 0.15 });
            io.observe(stage);
        }

        function delay(ms) {
            return new Promise(function (r) { setTimeout(r, ms); });
        }

        function waitForReady() {
            if (visible && inView) return Promise.resolve();
            return new Promise(function (resolve) {
                var t = setInterval(function () {
                    if (visible && inView) {
                        clearInterval(t);
                        resolve();
                    }
                }, 250);
            });
        }

        function reset() {
            stage.classList.remove('gr-state-bill', 'gr-state-voting', 'gr-state-done', 'gr-state-passed', 'gr-state-failed');
            cells.forEach(function (c) {
                c.classList.remove('is-yea', 'is-nay');
            });
            yeaEl.textContent = '0';
            nayEl.textContent = '0';
            resultEl.textContent = '';
        }

        function buildVoteOrder(yeaRate) {
            // Decide each rep's vote up-front, then shuffle reveal order so the
            // counter doesn't tell you the answer in the first row.
            var votes = [];
            var yeaCount = Math.round(TOTAL * yeaRate);
            for (var i = 0; i < TOTAL; i++) {
                votes.push(i < yeaCount ? 'yea' : 'nay');
            }
            // Fisher-Yates
            for (var j = votes.length - 1; j > 0; j--) {
                var k = Math.floor(Math.random() * (j + 1));
                var tmp = votes[j]; votes[j] = votes[k]; votes[k] = tmp;
            }
            // Reveal order: row-by-row left-to-right (clear cascade), but assign
            // votes randomly per cell so neighbors don't clump.
            var order = [];
            for (var r = 0; r < ROWS; r++) {
                for (var c = 0; c < COLS; c++) {
                    order.push({ idx: r * COLS + c, vote: votes[r * COLS + c] });
                }
            }
            return order;
        }

        async function loop() {
            var billIdx = 0;
            while (true) {
                await waitForReady();
                reset();

                var bill = BILLS[billIdx % BILLS.length];
                billIdx++;
                billId.textContent = bill.id;
                billTitle.textContent = bill.title;

                // Bill slides in
                stage.classList.add('gr-state-bill');
                await delay(900);

                // Start voting
                stage.classList.add('gr-state-voting');
                var order = buildVoteOrder(bill.yeaRate);
                var yea = 0, nay = 0;
                for (var i = 0; i < order.length; i++) {
                    var o = order[i];
                    var cell = cells[o.idx];
                    if (o.vote === 'yea') {
                        cell.classList.add('is-yea');
                        yea++;
                        yeaEl.textContent = String(yea);
                    } else {
                        cell.classList.add('is-nay');
                        nay++;
                        nayEl.textContent = String(nay);
                    }
                    await delay(40);
                }

                // Result stamp
                var passed = yea > nay;
                resultEl.textContent = passed ? 'PASSED' : 'FAILED';
                stage.classList.add(passed ? 'gr-state-passed' : 'gr-state-failed', 'gr-state-done');
                await delay(2400);
            }
        }

        loop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();

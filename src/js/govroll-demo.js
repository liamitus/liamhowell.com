/**
 * Govroll demo loop
 * Bill slides in -> 50 rep dots cascade-flip green/red -> tally settles.
 * Plays while hovered or focused. On mouse-out it pauses in place and keeps
 * its spot in the loop; on mouse-back-in it resumes from that point (no restart).
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

        var card = stage.closest('.project-card') || stage;
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

        // ----- Pausable timeline -----
        // wait(ms) resolves after `ms` of *unpaused* time. Pausing banks the
        // time left in the current step so the loop holds its exact place;
        // resuming counts down the remainder. The loop stalls on its awaits.
        var paused = true;     // first hover/focus starts it
        var started = false;
        var pending = null;    // { resolve, remaining, startedAt, timer }

        function arm() {
            pending.startedAt = Date.now();
            pending.timer = setTimeout(function () {
                var r = pending.resolve; pending = null; r();
            }, pending.remaining);
        }
        function wait(ms) {
            return new Promise(function (resolve) {
                pending = { resolve: resolve, remaining: ms, startedAt: 0, timer: null };
                if (!paused) arm();
            });
        }
        function pause() {
            if (paused) return;
            paused = true;
            stage.classList.add('is-demo-paused');
            if (pending && pending.timer) {
                clearTimeout(pending.timer);
                pending.timer = null;
                pending.remaining = Math.max(0, pending.remaining - (Date.now() - pending.startedAt));
            }
        }
        function resume() {
            if (!paused) return;
            paused = false;
            stage.classList.remove('is-demo-paused');
            if (pending && !pending.timer) arm();
            if (!started) { started = true; loop(); }
        }

        var billIdx = 0;

        async function loop() {
            while (true) {
                reset();

                var bill = BILLS[billIdx % BILLS.length];
                billIdx++;
                billId.textContent = bill.id;
                billTitle.textContent = bill.title;

                stage.classList.add('gr-state-bill');
                await wait(900);

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
                    await wait(40);
                }

                var passed = yea > nay;
                resultEl.textContent = passed ? 'PASSED' : 'FAILED';
                stage.classList.add(passed ? 'gr-state-passed' : 'gr-state-failed', 'gr-state-done');
                await wait(2400);
            }
        }

        // Play while hovered OR keyboard-focused; pause only when neither holds.
        var hovering = false, focused = false;
        card.addEventListener('pointerenter', function () { hovering = true; resume(); });
        card.addEventListener('pointerleave', function () { hovering = false; if (!focused) pause(); });
        card.addEventListener('focusin', function () { focused = true; resume(); });
        card.addEventListener('focusout', function () { focused = false; if (!hovering) pause(); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();

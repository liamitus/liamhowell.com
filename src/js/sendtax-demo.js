/**
 * SendTax demo loop
 * Drop a doc -> scan -> classify -> checklist fills.
 */
(function () {
    function setup() {
        var stage = document.getElementById('sendtax-stage');
        if (!stage) return;

        var doc = stage.querySelector('[data-st="doc"]');
        var dz = stage.querySelector('[data-st="dropzone"]');
        var scan = stage.querySelector('[data-st="scan"]');
        var badge = stage.querySelector('[data-st="badge"]');
        var items = stage.querySelectorAll('[data-st-item]');

        function reset() {
            stage.classList.remove('st-state-drop', 'st-state-scan', 'st-state-classified', 'st-state-listing', 'st-state-done');
            items.forEach(function (li) { li.classList.remove('is-checked'); });
        }

        // Pause when offscreen / tab hidden.
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

        function step(state, ms) {
            return new Promise(function (resolve) {
                if (state) stage.classList.add(state);
                setTimeout(resolve, ms);
            });
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

        async function loop() {
            while (true) {
                await waitForReady();
                reset();
                await step(null, 700);                  // settle
                await step('st-state-drop', 1100);      // doc travels into dropzone
                await step('st-state-scan', 1400);      // scan line sweeps
                await step('st-state-classified', 1100); // badge pops
                stage.classList.add('st-state-listing');
                await step(null, 250);
                items[0].classList.add('is-checked');
                await step(null, 500);
                items[1].classList.add('is-checked');
                await step(null, 500);
                items[2].classList.add('is-checked');
                await step('st-state-done', 1800);
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

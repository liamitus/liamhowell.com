/**
 * SendTax demo loop
 * Drop a doc -> scan -> classify -> checklist fills.
 * Animates only while the card is hovered or focused.
 */
(function () {
    function setup() {
        var stage = document.getElementById('sendtax-stage');
        if (!stage) return;

        var card = stage.closest('.project-card') || stage;
        var items = stage.querySelectorAll('[data-st-item]');

        function reset() {
            stage.classList.remove('st-state-drop', 'st-state-scan', 'st-state-classified', 'st-state-listing', 'st-state-done');
            items.forEach(function (li) { li.classList.remove('is-checked'); });
        }

        function step(state, ms) {
            return new Promise(function (resolve) {
                if (state) stage.classList.add(state);
                setTimeout(resolve, ms);
            });
        }

        // Token bumped on every start/stop. Live loops check it after each
        // await and bail if it changed — that's how we cancel mid-animation.
        var token = 0;

        async function loop(myToken) {
            while (myToken === token) {
                reset();
                await step(null, 700);
                if (myToken !== token) return;
                await step('st-state-drop', 1100);
                if (myToken !== token) return;
                await step('st-state-scan', 1400);
                if (myToken !== token) return;
                await step('st-state-classified', 1100);
                if (myToken !== token) return;
                stage.classList.add('st-state-listing');
                await step(null, 250);
                if (myToken !== token) return;
                items[0].classList.add('is-checked');
                await step(null, 500);
                if (myToken !== token) return;
                items[1].classList.add('is-checked');
                await step(null, 500);
                if (myToken !== token) return;
                items[2].classList.add('is-checked');
                await step('st-state-done', 1800);
            }
        }

        function start() {
            var myToken = ++token;
            loop(myToken);
        }

        function stop() {
            token++;
            reset();
        }

        card.addEventListener('pointerenter', start);
        card.addEventListener('pointerleave', stop);
        card.addEventListener('focusin', start);
        card.addEventListener('focusout', stop);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();

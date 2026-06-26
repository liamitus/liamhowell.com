/**
 * SendTax demo loop
 * Drop a doc -> scan -> classify -> checklist fills.
 * Plays while hovered or focused. On mouse-out it pauses in place and keeps
 * its spot in the loop; on mouse-back-in it resumes from that point (no restart).
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

        // ----- Pausable timeline -----
        // wait(ms) resolves after `ms` of *unpaused* time. Pausing banks the
        // time left in the current step (and freezes CSS keyframes via
        // .is-demo-paused) so the loop holds its exact place; resuming counts
        // down the remainder. The loop itself just stalls on its awaits.
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

        function step(state, ms) {
            if (state) stage.classList.add(state);
            return wait(ms);
        }

        async function loop() {
            while (true) {
                reset();
                await step(null, 700);
                await step('st-state-drop', 1100);
                await step('st-state-scan', 1400);
                await step('st-state-classified', 1100);
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

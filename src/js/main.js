/**
 * liamhowell.com
 * Liam Howell
 */

/* ========================================
   Pretty Colors
   Most colors from prettycolors.tumblr.com
   ======================================== */
(function () {
    var colors = [
        '#17334a', // Navy          — 10.5:1 on white
        '#9c5038', // Terracotta    —  5.2:1 on white
        '#4a7332', // Forest green  —  5.0:1 on white
        '#3e5f82', // Slate blue    —  5.4:1 on white
        '#575766', // Cool gray     —  5.1:1 on white
        '#2b6585', // Deep teal     —  5.2:1 on white
        '#7a4b6a', // Plum          —  5.5:1 on white
        '#6b5d2e'  // Olive         —  5.1:1 on white
    ];

    var currentColorSet = [];

    function generateRandomColorSet() {
        currentColorSet = shuffle(colors.slice());
        return currentColorSet;
    }

    // Fisher-Yates (aka Knuth) Shuffle
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    function pickColor() {
        if (currentColorSet.length <= 0) {
            generateRandomColorSet();
        }
        return currentColorSet.pop();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var el = document.getElementById('header-accent');
        if (!el) return;

        function setAccent(color) {
            el.style.background = color;
            document.documentElement.style.setProperty('--accent', color);
        }

        // Start with a random color
        setAccent(pickColor());

        // Cycle on click with smooth CSS transition
        el.addEventListener('click', function () {
            var before = el.style.background;
            var after = before;
            while (before === after) {
                after = pickColor();
            }
            setAccent(after);
        });
    });
})();


/* ========================================
   High-five interaction
   ======================================== */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('wave-emoji');
        if (!btn) return;

        var glyph = btn.querySelector('.wave-glyph');
        var swapTimer = null;
        var currentAnim = null;

        // Total length of the slap sequence in ms. Breakdown:
        //   0 – 120ms : settle — rotate from current wave angle to 0deg
        //   120 – 720 : the actual high-five (keyframe swing + recovery)
        var SETTLE_MS = 120;
        var SLAP_MS = 720;

        function slap() {
            // Intentionally does NOT stop propagation — the click bubbles up
            // to the header-accent handler so the color also cycles.
            if (swapTimer) { clearTimeout(swapTimer); swapTimer = null; }
            if (currentAnim) { try { currentAnim.cancel(); } catch (e) {} currentAnim = null; }
            btn.classList.remove('is-high-five');
            glyph.textContent = '\uD83D\uDC4B'; // 👋

            // Capture the glyph's live rotation so the sequence starts from
            // wherever the wave animation currently is — no snap to 0.
            var startTransform = getComputedStyle(glyph).transform;
            if (startTransform === 'none') startTransform = 'rotate(0deg)';

            // Kill the CSS wave-hand for the duration of the slap. We will
            // restart it fresh when the slap finishes so it doesn't resume
            // mid-rotation.
            glyph.style.animation = 'none';

            // One continuous WAAPI animation: settle → windup → swing →
            // recovery → rest. Using WAAPI (rather than a CSS class) so we
            // can start from an arbitrary rotation instead of snapping.
            var settleEnd = SETTLE_MS / SLAP_MS; // ~0.17
            currentAnim = glyph.animate([
                { transform: startTransform,                          offset: 0 },
                { transform: 'rotate(0deg) scale(1)',                 offset: settleEnd,         easing: 'ease-out' },
                { transform: 'rotate(-22deg) scale(1.08)',            offset: settleEnd + 0.18 },
                { transform: 'rotate(16deg) scale(1.4)',              offset: settleEnd + 0.40 },
                { transform: 'rotate(-4deg) scale(0.95)',             offset: settleEnd + 0.62 },
                { transform: 'rotate(0deg) scale(1)',                 offset: 1 }
            ], {
                duration: SLAP_MS,
                easing: 'ease-in-out',
                fill: 'none'
            });

            // Once the settle phase is done, swap to open palm and let the
            // ripple/spark pseudo-element animations fire for the hit.
            swapTimer = setTimeout(function () {
                glyph.textContent = '\u270B'; // ✋
                btn.classList.add('is-high-five');
                swapTimer = null;
            }, SETTLE_MS);

            currentAnim.onfinish = function () {
                btn.classList.remove('is-high-five');
                glyph.textContent = '\uD83D\uDC4B'; // 👋
                try { currentAnim.cancel(); } catch (e) {}
                currentAnim = null;
                // Restart CSS wave-hand from the top (with its 0.6s delay).
                glyph.style.animation = '';
            };
        }

        btn.addEventListener('click', slap);
    });
})();


/* ========================================
   Photo lightbox
   ======================================== */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var trigger = document.getElementById('photo-trigger');
        var modal = document.getElementById('photo-modal');
        var closeBtn = document.getElementById('photo-modal-close');
        if (!trigger || !modal || !closeBtn) return;

        var lastFocused = null;

        function open() {
            lastFocused = document.activeElement;
            modal.hidden = false;
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
            document.addEventListener('keydown', onKey);
        }

        function close() {
            modal.hidden = true;
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKey);
            if (lastFocused && lastFocused.focus) lastFocused.focus();
        }

        function onKey(e) {
            if (e.key === 'Escape') close();
        }

        trigger.addEventListener('click', open);
        closeBtn.addEventListener('click', close);
        modal.addEventListener('click', function (e) {
            // Click on backdrop (not the image itself) closes.
            if (e.target === modal || e.target.classList.contains('photo-modal-img')) close();
        });
    });
})();


/* ========================================
   Console easter egg
   ======================================== */
console.log('%c Hey friend! ', 'background: #17334a; color: white; font-size: 14px; padding: 4px 8px; border-radius: 3px;');
console.log('Building something cool at https://send.tax');
console.log('Source: https://github.com/liamitus/liamhowell.com');

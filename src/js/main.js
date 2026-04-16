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
        // Fallback duration in case animationend doesn't fire (e.g. reduced
        // motion). Should be slightly longer than the wave-high-five keyframe.
        var FALLBACK_MS = 700;
        var fallbackTimer = null;

        // Note: we deliberately do NOT swap to ✋ for the high-five. The two
        // emoji glyphs (👋 and ✋) are drawn at different intrinsic angles
        // (~45° vs 0°), so swapping mid-animation reads as the hand jumping
        // to a new orientation. Keeping 👋 throughout — the slap motion,
        // scale pulse, ripple, and sparks carry the gesture.
        function reset() {
            if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
            btn.classList.remove('is-high-five');
        }

        function slap() {
            // Intentionally does NOT stop propagation — the click bubbles up
            // to the header-accent handler so the color also cycles.

            // Restart cleanly if a previous slap is still in flight: pop the
            // class, force a reflow so the animation can re-trigger.
            reset();
            void glyph.offsetWidth;

            btn.classList.add('is-high-five');
            fallbackTimer = setTimeout(reset, FALLBACK_MS);
        }

        // Listen on the inner glyph so we only react to wave-high-five
        // (the wave-hand on the wrapper would never fire animationend
        // because it's infinite, but be specific anyway).
        glyph.addEventListener('animationend', function (e) {
            if (e.animationName === 'wave-high-five') reset();
        });

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

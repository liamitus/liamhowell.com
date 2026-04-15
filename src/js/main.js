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
        var clearTimer = null;

        function slap() {
            // Intentionally does NOT stop propagation — the click bubbles up
            // to the header-accent handler so the color also cycles.
            if (clearTimer) {
                clearTimeout(clearTimer);
                btn.classList.remove('is-high-five');
                // Force reflow so the animation restarts on rapid clicks.
                void btn.offsetWidth;
            }
            // Swap glyph to an open palm for the duration of the hit.
            glyph.textContent = '\u270B'; // ✋
            btn.classList.add('is-high-five');

            clearTimer = setTimeout(function () {
                btn.classList.remove('is-high-five');
                glyph.textContent = '\uD83D\uDC4B'; // 👋
                clearTimer = null;
            }, 600);
        }

        btn.addEventListener('click', slap);
    });
})();


/* ========================================
   Console easter egg
   ======================================== */
console.log('%c Hey friend! ', 'background: #17334a; color: white; font-size: 14px; padding: 4px 8px; border-radius: 3px;');
console.log('Building something cool at https://send.tax');
console.log('Source: https://github.com/liamitus/liamhowell.com');

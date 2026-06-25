/**
 * Hidden arcade
 * High-five the wave → a corner of the page peels back. Click that corner →
 * the whole page sheet peels away to reveal the games room behind it.
 */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var sheet = document.getElementById('page-sheet');
        var peel = document.getElementById('page-peel');
        var room = document.getElementById('games-room');
        var backBtn = document.getElementById('room-back');
        if (!sheet || !peel || !room) return;

        var revealed = false; // corner peeled back and inviting a click
        var open = false;     // sheet peeled away, room showing

        // Show the peeled corner. Only ever called from a high-five, and never
        // persisted — so the arcade stays fully hidden until the visitor
        // actually high-fives, every page load.
        function revealPeel() {
            if (revealed) return;
            revealed = true;
            peel.hidden = false;
            // Force a reflow so the grow-in transition runs from the hidden state.
            void peel.offsetWidth;
            peel.classList.add('is-in');
        }

        function prefersReduced() {
            return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }

        // Use the soft-fold curl when supported; otherwise the CSS peel.
        function useCurl() {
            return window.PeelCurl && window.PeelCurl.isSupported() && !prefersReduced();
        }

        function finishOpen() {
            sheet.setAttribute('inert', '');
            sheet.setAttribute('aria-hidden', 'true');
            if (backBtn) backBtn.focus();
            document.addEventListener('keydown', onKey);
        }

        function openRoom() {
            if (open) return;
            open = true;

            // The arcade is the end state; reveal it now (it sits behind the
            // sheet until the peel uncovers it).
            room.removeAttribute('inert');
            room.setAttribute('aria-hidden', 'false');
            document.body.classList.add('arcade-open');
            peel.classList.add('is-spent');

            if (useCurl()) {
                window.PeelCurl.run(sheet, room).then(finishOpen).catch(function () {
                    // Curl unsupported — fall back to the CSS peel.
                    sheet.style.visibility = '';
                    sheet.classList.remove('is-restoring');
                    sheet.classList.add('is-peeling');
                    finishOpen();
                });
            } else {
                sheet.classList.remove('is-restoring');
                sheet.classList.add('is-peeling');
                finishOpen();
            }
        }

        function finishClose() {
            document.body.classList.remove('arcade-open');
            peel.classList.remove('is-spent');
            sheet.style.visibility = '';
            sheet.removeAttribute('inert');
            sheet.removeAttribute('aria-hidden');
            // Return focus to the corner so keyboard users keep their place.
            if (peel.focus) peel.focus();
        }

        function closeRoom() {
            if (!open) return;
            open = false;

            room.setAttribute('inert', '');
            room.setAttribute('aria-hidden', 'true');
            document.removeEventListener('keydown', onKey);

            if (window.PeelCurl && window.PeelCurl.canReverse()) {
                // Un-curl the page back over the arcade.
                window.PeelCurl.reverse(sheet).then(finishClose, finishClose);
            } else {
                sheet.classList.remove('is-peeling');
                sheet.classList.add('is-restoring');
                finishClose();
            }
        }

        function onKey(e) {
            if (e.key === 'Escape') closeRoom();
        }

        // Let the restore animation re-run cleanly next time it opens.
        sheet.addEventListener('animationend', function (e) {
            if (e.animationName === 'page-peel-on') {
                sheet.classList.remove('is-restoring');
            }
        });

        peel.addEventListener('click', openRoom);
        if (backBtn) backBtn.addEventListener('click', closeRoom);
        document.addEventListener('liam:highfive', revealPeel);
    });
})();

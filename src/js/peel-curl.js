/**
 * Soft page-peel — no libraries, no snapshot.
 *
 * The page is cut along a diagonal crease that sweeps from the top-right corner
 * toward the bottom-left (a CSS mask). The not-yet-peeled side keeps showing the
 * real page; the peeled corner is an identical DOM *clone* that folds over the
 * crease in 3D, with a shading overlay that ramps in to read as the paper's
 * curled-over back. Because both layers are live DOM (not a rasterized
 * snapshot) the content never shifts — there's no swap, so no "jump".
 *
 * Works anywhere CSS masks + 3D transforms do (all current browsers, mobile
 * included). Where they don't, isSupported() returns false and the caller
 * falls back to a plain fade.
 *
 * window.PeelCurl: isSupported(), run(fromEl, toEl), canReverse(), reverse(fromEl)
 */
(function () {
    'use strict';

    var DURATION = 1250;
    var THICKNESS = 38;    // curl diameter in px

    var built = null;      // { flatWrap, flapWrap, shade }
    var refs = null;       // { fromEl } for reverse
    var didCurl = false;

    function maskSupported() {
        return (CSS.supports('mask-image', 'linear-gradient(#000,#000)') ||
            CSS.supports('-webkit-mask-image', 'linear-gradient(#000,#000)'));
    }

    function isSupported() {
        return typeof CSS !== 'undefined' && CSS.supports &&
            maskSupported() &&
            CSS.supports('transform', 'perspective(1px) rotate3d(1,1,0,1deg)');
    }

    function setMask(el, value) {
        el.style.webkitMaskImage = value;
        el.style.maskImage = value;
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // A clone of the page that renders identically to the original (same engine,
    // same fonts) — so no visual shift when it overlays the real content.
    function clonePage(fromEl) {
        var c = fromEl.cloneNode(true);
        c.removeAttribute('id');
        var ided = c.querySelectorAll('[id]');
        for (var i = 0; i < ided.length; i++) ided[i].removeAttribute('id');
        c.style.position = 'absolute';
        c.style.top = '0';
        c.style.left = '0';
        c.style.width = Math.round(fromEl.getBoundingClientRect().width) + 'px';
        c.style.margin = '0';
        c.style.visibility = 'visible'; // in case the source was hidden (reverse)
        c.setAttribute('aria-hidden', 'true');
        return c;
    }

    function build(fromEl) {
        var flatWrap = document.createElement('div');
        flatWrap.className = 'peel-fold-layer peel-fold-flat';
        flatWrap.appendChild(clonePage(fromEl));

        // A rolled-paper edge that sweeps along the crease. A flat slab can't
        // curve, but a glossy rolled lip reads as the page curling up.
        var lip = document.createElement('div');
        lip.className = 'peel-fold-lip';
        lip.style.width = Math.ceil(3 * Math.hypot(window.innerWidth, window.innerHeight)) + 'px';
        lip.style.height = THICKNESS + 'px';

        document.body.appendChild(flatWrap);
        document.body.appendChild(lip);

        built = { flatWrap: flatWrap, lip: lip };
        return built;
    }

    function teardown() {
        if (!built) return;
        if (built.flatWrap.parentNode) built.flatWrap.parentNode.removeChild(built.flatWrap);
        if (built.lip.parentNode) built.lip.parentNode.removeChild(built.lip);
        built = null;
    }

    // Position everything for an eased progress value in [0,1]. The crease
    // sweeps from the top-right corner toward the bottom-left.
    function apply(e) {
        if (!built) return;
        var W = window.innerWidth, H = window.innerHeight;
        var stop = (e * 100).toFixed(3) + '%';

        // The not-yet-peeled page keeps its bottom-left side; the top-right is
        // masked away, uncovering the arcade behind.
        setMask(built.flatWrap,
            'linear-gradient(to bottom left, transparent ' + stop + ', #000 ' + stop + ')');

        // The rolled lip rides the crease line (through the crease point, along
        // the page's other diagonal).
        var px = W * (1 - e), py = H * e;
        var deg = Math.atan2(W, H) * 180 / Math.PI;
        built.lip.style.left = px.toFixed(1) + 'px';
        built.lip.style.top = py.toFixed(1) + 'px';
        built.lip.style.transform = 'translate(-50%, -50%) rotate(' + deg.toFixed(2) + 'deg)';
    }

    function animate(from, to) {
        return new Promise(function (resolve) {
            var start = null;
            function frame(ts) {
                if (start === null) start = ts;
                var t = Math.min(1, (ts - start) / DURATION);
                var p = from + (to - from) * t;
                apply(easeInOutCubic(p));
                if (t < 1) requestAnimationFrame(frame);
                else resolve();
            }
            requestAnimationFrame(frame);
        });
    }

    function run(fromEl, toEl) {
        if (!isSupported()) return Promise.reject(new Error('unsupported'));
        refs = { fromEl: fromEl };
        window.scrollTo(0, 0);
        build(fromEl);
        apply(0);                       // first frame == the page, unchanged
        fromEl.style.visibility = 'hidden';
        return animate(0, 1).then(function () {
            teardown();
            didCurl = true;
        });
    }

    function canReverse() {
        return didCurl && !!refs;
    }

    function reverse(fromEl) {
        if (!canReverse()) return Promise.reject(new Error('nothing to reverse'));
        var el = fromEl || refs.fromEl;
        window.scrollTo(0, 0);
        build(el);
        apply(1);
        return animate(1, 0).then(function () {
            teardown();
            el.style.visibility = '';
            didCurl = false;
        });
    }

    window.PeelCurl = {
        isSupported: isSupported,
        run: run,
        canReverse: canReverse,
        reverse: reverse
    };
})();

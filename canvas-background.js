/* Liam Howell 01-12-2015 */
(function () {
    var canvas = document.getElementById("canvas-background");
    var context = canvas.getContext("2d");

    // Resize the canvas to fit the window.
    window.addEventListener("resize", resizeCanvas, false);

    function resizeCanvas() {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        canvas.width = windowWidth;
        canvas.height = windowHeight;
        // Drawing happens here so it isn't reset when the canvas is resized.
        drawBackground(windowWidth, windowHeight);
    }

    function drawBackground(canvasWidth, canvasHeight) {
        var thirdOfTheHeight = canvasHeight / 3;

        // Begin custom shape.
        context.moveTo(0, (canvasHeight - thirdOfTheHeight));
        context.lineTo(canvasWidth, thirdOfTheHeight);
        context.lineTo(canvasWidth, canvasHeight);
        context.lineTo(0, canvasHeight);

        // Complete custom shape.
        context.closePath();
        context.fillStyle = "#328A2E"
        context.fill();

    }

    // Liftoff
    resizeCanvas();

})();

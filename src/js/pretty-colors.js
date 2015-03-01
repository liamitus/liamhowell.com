/**
 * Pretty color randomizer.
 * Most of the colors come from prettycolors.tumblr.com
 *
 * Liam Howell
 * 02-23-2015
 */
(function (document) {

    var colors = [
        '#17334a', // Dark dark blue
        '#d1907a', // Faded salmon
        '#7b9e61', // Faded green
        '#7688a7', // Faded blue-gray
        '#575766', // Blue-gray
        //'#f58275', // Salmon
        'steelblue' // The original
    ];

    // The set of colors currently in the loop.
    var currentColorSet = generateRandomColorSet;

    function generateRandomColorSet() {
        return currentColorSet = shuffle(colors.slice());
    }

    // Fisher-Yates (aka Knuth) Shuffle
    // Thanks to stackoverflow user :
    // http://stackoverflow.com/a/2450976/1729686
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    
    // Pick a random color from the set of colors.
    // Uses a temporary stack of colors to improve consistency.
    function pickColor() {
        if (currentColorSet.length <= 0) {
            generateRandomColorSet();
        }
        return currentColorSet.pop();
    }

    var app = angular.module('prettyColors', []);

    app.directive('prettyColor', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var element = $element[0];
                var startRandomized = $attrs.prettyColor;
                var before = element.style.background;
                var after = before;
                if (startRandomized) {
                    element.style.background = pickColor();
                }
                $element.on('click', function () {
                    while (before === after) {
                        after = element.style.background = pickColor();
                    }
                    before = after;
                });
            }
        };
    });

})(document);

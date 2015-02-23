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

    function pickColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    var app = angular.module('prettyColors', []);

    app.directive('prettyColor', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var element = $element[0];
                var startRandomized = $attrs.prettyColor;
                if (startRandomized) {
                    element.style.background = pickColor();
                }
                $element.on('click', function () {
                    element.style.background = pickColor();
                });
            }
        };
    });

})(document);

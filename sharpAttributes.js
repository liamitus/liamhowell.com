var app = angular.module('sharpAttributes', []);

var resizeEvents = [];

app.directive('fullscreen', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.css('position', 'absolute');

            scope.onResize = function () {
                element.css('height', $window.innerHeight + 'px');
                element.css('width', $window.innerWidth + 'px');
            };
            scope.onResize();

            resizeEvents.push(scope.onResize);

            $window.addEventListener('resize', function () {
                for (var i = 0; i < resizeEvents.length; i++) {
                    resizeEvents[i]();
                }
                scope.$apply();
            });
        }
    };
}]);

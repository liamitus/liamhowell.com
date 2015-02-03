/** 
 * Liam Howell
 * 01-31-2015
 */
var app = angular.module('lgh', ['sharpAttributes']);

app.directive('metaStuff', function () {
	return {
		restrict: 'E',
		templateUrl: 'meta-stuff.html'
	};
});

// The name directive.
app.directive('name', ['$window', function ($window) {
	return {
		restrict: 'E',
		templateUrl: 'name.html'
	};
}]);

app.directive('inverseColorName', function () {
	return {
		restrict: 'E',
		templateUrl: 'name.html'
	};
});



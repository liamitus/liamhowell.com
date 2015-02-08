/** 
 * Liam Howell
 * 02-08-2015
 */
var app = angular.module('lgh', ['sharpAttributes']);

app.directive('metaStuff', function () {
	return {
		restrict: 'E',
		templateUrl: 'meta-stuff.html'
	};
});

// The name directive.
app.directive('liam', ['$window', function ($window) {
	return {
		restrict: 'E',
		templateUrl: 'name.html'
	};
}]);

app.directive('bizarroLiam', function () {
	return {
		restrict: 'E',
		templateUrl: 'name.html'
	};
});



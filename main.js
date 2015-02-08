/** 
 * Liam Howell
 * 02-08-2015
 */
var app = angular.module('lgh', ['sharpAttributes']);

app.directive('metaStuff', function () {
	return {
		restrict: 'E',
		templateUrl: 'templates/meta-stuff.html'
	};
});

// The name directive.
app.directive('liam', ['$window', function ($window) {
	return {
		restrict: 'E',
		templateUrl: 'templates/name.html'
	};
}]);

app.directive('bizarroLiam', function () {
	return {
		restrict: 'E',
		templateUrl: 'templates/bizarro-name.html'
	};
});

app.directive('mainContent', function () {
	return {
		restrict: 'E',
		templateUrl: 'templates/main-content.html'
	};
});

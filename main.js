/** 
 * Liam Howell
 * 02-23-2015
 */
var app = angular.module('lgh', ['prettyColors']);

// Creates a new directive from a given name.
// Accepts an optional file name for the template URL, otherwise will use
// the name param for the file name.
// Also accepts an optional transclude parameter.
function directive(name, templateFileName, transclude) {
	templateFileName = templateFileName || name;
	app.directive(name, function () {
		return {
			restrict: 'E',
			transclude: transclude,
			templateUrl: 'templates/' + templateFileName + '.html'
		};
	});
}

directive('liam', 'name');
directive('bizarroLiam', 'bizarro-name');
directive('mainContent', 'main-content', true);
directive('photo');
directive('about');
directive('cv');
directive('contact');


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
			templateUrl: templateFileName + '.html'
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

console.log(' ___       ___  ________  _____ ______           ___  ___  ________  ___       __   _______   ___       ___          ');
console.log('|\\  \\     |\\  \\|\\   __  \\|\\   _ \\  _   \\        |\\  \\|\\  \\|\\   __  \\|\\  \\     |\\  \\|\\  ___ \\ |\\  \\     |\\  \\         ');
console.log('\\ \\  \\    \\ \\  \\ \\  \\|\\  \\ \\  \\\\\\__\\ \\  \\       \\ \\  \\\\\\  \\ \\  \\|\\  \\ \\  \\    \\ \\  \\ \\   __/|\\ \\  \\    \\ \\  \\        ');
console.log(' \\ \\  \\    \\ \\  \\ \\   __  \\ \\  \\\\|__| \\  \\       \\ \\   __  \\ \\  \\\\\\  \\ \\  \\  __\\ \\  \\ \\  \\_|/_\\ \\  \\    \\ \\  \\       ');
console.log('  \\ \\  \\____\\ \\  \\ \\  \\ \\  \\ \\  \\    \\ \\  \\       \\ \\  \\ \\  \\ \\  \\\\\\  \\ \\  \\|\\__\\_\\  \\ \\  \\_|\\ \\ \\  \\____\\ \\  \\____  ');
console.log('   \\ \\_______\\ \\__\\ \\__\\ \\__\\ \\__\\    \\ \\__\\       \\ \\__\\ \\__\\ \\_______\\ \\____________\\ \\_______\\ \\_______\\ \\_______\\');
console.log('    \\|_______|\\|__|\\|__|\\|__|\\|__|     \\|__|        \\|__|\\|__|\\|_______|\\|____________|\\|_______|\\|_______|\\|_______|');
console.log('                                                                                                                     ');
console.log('Hey friend! Enjoy picking apart my personal site thing: https://github.com/liamitus/liamhowell.com');

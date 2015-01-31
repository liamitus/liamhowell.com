/** 
 * Liam Howell
 * 01-31-2015
 */
var app = angular.module('lgh', ['sharpAttributes']);

app.directive('mainContent', function () {
	return {
		restrict: 'E',
		templateUrl: 'main-content.html'
	};
});

app.directive('metaStuff', function () {
	return {
		restrict: 'E',
		templateUrl: 'meta-stuff.html'
	};
});

// Calculate the slope of a line, given two points.
// Points are given as two element arrays, i.e., [x, y]
// Returns the answer in degrees.
function calculateSlope(point1, point2) {
	var deltaX = point2[0] - point1[0];
	var deltaY = point2[1] - point1[1];
	var slope = deltaY / deltaX;
	slope *= 100;
	return slope;
}

// Retrieve the left point of the background line, from the given $window.
function getBackgrounLeftPoint($window) {
	var windowHeight = $window.innerHeight;
	var thirdOfWindowHeight = windowHeight / 3;
	return [
		0, // x
		windowHeight - thirdOfWindowHeight // y
	];
}

// Retrieve the right point of the background line, from the given $window.
function getBackgroundRightPoint($window) {
	var windowWidth = $window.innerWidth;
	var windowHeight = $window.innerHeight;
	var thirdOfWindowHeight = windowHeight / 3;
	return [
		windowWidth, // x
		thirdOfWindowHeight // y
	];
}

// Retrieve the degrees of the slope from a given window.
function getBackgroundDegrees($window) {
	var p1 = getBackgrounLeftPoint($window);
	var p2 = getBackgroundRightPoint($window);
	var degrees = calculateSlope(p1, p2);
	return degrees;
}

// Determine if a given string ends with a semicolon;
function endsWithSemicolon(str) {
	return str.substr(str.length - 1) == ';';
}

// Add a given string to the given element (jqLite selector) without clobbering
// existing style string.
function addToElementStyle($element, stringToAdd) {
	var originalStyle = $element[0].style.cssText;
	var updatedStyle = originalStyle.trim();
	if (!endsWithSemicolon(updatedStyle)) {
		updatedStyle += ';';
	}
	updatedStyle += stringToAdd;
	if (!endsWithSemicolon(stringToAdd)) {
		updatedStyle += ';';
	}
	$element[0].style.cssText = updatedStyle;
}

// Rotate the given element, by the given degrees.
function applyCSSRotation($element, degrees) {
	var rotationCSS = '-webkit-transform: rotate(' + degrees + 'deg)';
	addToElementStyle($element, rotationCSS);
}

// Apply the given function to the children of the given element.
function applyToChildren($element, func) {
	var children = $element.children();
	for (var i = 0; i < children.length; i++) {
		func(angular.element(children[i]));
	}
}

// Apply the rotation rules to the given element, based on the given window.
function applyRotation($window, $element) {
	var degrees = getBackgroundDegrees($window);
	applyCSSRotation($element, degrees);
	applyToChildren($element, function ($child) {
		applyCSSRotation($child, -degrees);
	});
}

// Apply the left adjustment to keep the bottom right corner in place.
// Applies counter adjustment to the children elements.
function applyLeftAdjustment($element, rotatedPoints) {
	var leftAdjustment = $element[0].offsetLeft - rotatedPoints[2][0];
	addToElementStyle($element, 'left: ' + leftAdjustment + 'px');
	applyToChildren($element, function ($child) {
		addToElementStyle($child, 'padding-left: ' + (-leftAdjustment) + 'px');
	});
}

// Apply width adjustment to keep the rotated element filling the window.
function applyWidthAdjustment($window, $element) {
	var originalLocation = getCornerPoints($element);
	var degrees = getBackgroundDegrees($window);
	var radians = degrees * (Math.PI/180);
	var rotatedPoints = getRotatedCoordinates(originalLocation, originalLocation[0], radians);

	var missingWidth = $window.innerWidth - rotatedPoints[1][0];
	var widthAdjustment = $element[0].offsetWidth + missingWidth;

	addToElementStyle($element, 'width: ' + widthAdjustment + 'px');
}

function getCornerPoints($element) {
	var offset = $element[0].getBoundingClientRect();
	var top = offset.top;
	var left = offset.left;
	var width = $element[0].offsetWidth;
	var height = $element[0].offsetHeight;
	return [
		[left, top], // top left [x, y]
		[left + width, top], // top right [x, y]
		[left, top + height], // bottom left [x, y]
		[left + width, top + height] // bottom right [x, y]
	];
}

function calculateRotatedPoint(point, pointOfRotation, radians) {
	var theta = -radians; // Invert radians because magic.
	//console.log(theta);
	// Coordinates being rotated.
	var x = point[0];
	var y = point[1];
	// Center of rotation.
	var x0 = pointOfRotation[0];
	var y0 = pointOfRotation[1];
	// The rotated coordinates.
	var newX = x0 + (x - x0) * Math.cos(theta) + (y - y0) * Math.sin(theta);
	var newY = y0 - (x - x0) * Math.sin(theta) + (y - y0) * Math.cos(theta);
	return [newX, newY];
}

function getRotatedCoordinates(points, pointOfRotation, degrees) {
	var result = [];
	for (var i = 0; i < points.length; i++) {
		result.push(calculateRotatedPoint(points[i], pointOfRotation, degrees));
	}
	return result;
}

// Apply the rotation, and makes adjustments to the position and width to keep
// the corners of the element in the same place prior to rotation.
function applyTransformation($window, $element) {
	var originalLocation = getCornerPoints($element);
	var degrees = getBackgroundDegrees($window);
	var radians = degrees * (Math.PI/180);
	var rotatedPoints = getRotatedCoordinates(originalLocation, originalLocation[0], radians);

	applyLeftAdjustment($element, rotatedPoints);
	applyWidthAdjustment($window, $element);
	applyRotation($window, $element);
}

app.directive('name', ['$window', function ($window) {
	return {
		restrict: 'E',
		templateUrl: 'name.html',
		link: function ($scope, $element, $attributes) {
			// Apply the transformation right away.
			//applyTransformation($window, $element);
			// And apply it whenever the window is resized.
			$window.addEventListener('resize', function () {
				applyTransformation($window, $element);
			});
		}
	};
}]);

app.directive('backgroundTop', ['$window', function ($window) {
	function draw($window, polygonElement) {
		var windowWidth = $window.innerWidth;
		var windowHeight = $window.innerHeight;

		var thirdOfWindowHeight = windowHeight / 3;
		var p1 = {x: 0, y: 0};
		var p2 = {x: 0, y: windowHeight - thirdOfWindowHeight};
		var p3 = {x: windowWidth, y: thirdOfWindowHeight};
		var p4 = {x: windowWidth, y: 0};

		var points = ''
		points += p1.x + ',' + p1.y + ' ';
		points += p2.x + ',' + p2.y + ' ';
		points += p3.x + ',' + p3.y + ' ';
		points += p4.x + ',' + p4.y;

		polygonElement.attr('points', points);
	}
	return {
		restrict: 'E',
		templateUrl: 'background-top.html',
		link: function ($scope, $element, $attributes) {
			var polygon = $element.find('polygon');
			draw($window, polygon);
			$window.addEventListener('resize', function () {
				draw($window, polygon);
			});

			var fillColor = '#AAAAAA';
			polygon.css('fill', fillColor);
		}
	};
}]);

app.directive('backgroundBottom', ['$window', function ($window) {
	function draw($window, polygonElement) {
		var windowWidth = $window.innerWidth;
		var windowHeight = $window.innerHeight;

		var thirdOfWindowHeight = windowHeight / 3;

		var p1 = {x: 0, y: windowHeight - thirdOfWindowHeight};
		var p2 = {x: windowWidth, y: thirdOfWindowHeight};
		var p3 = {x: windowWidth, y: windowHeight};
		var p4 = {x: 0, y: windowHeight};

		var points = ''
		points += p1.x + ',' + p1.y + ' ';
		points += p2.x + ',' + p2.y + ' ';
		points += p3.x + ',' + p3.y + ' ';
		points += p4.x + ',' + p4.y;

		polygonElement.attr('points', points);
	}
	return {
		restrict: 'E',
		templateUrl: 'background-bottom.html',
		link: function ($scope, $element, $attributes) {
			var polygon = $element.find('polygon');
			draw($window, polygon);
			$window.addEventListener('resize', function () {
				draw($window, polygon);
			});

			var fillColor = '#328A2E';
			polygon.css('fill', fillColor);
		}
	};
}]);


app.directive('backgroundAccent', ['$window', function ($window) {
	function draw($window, polygonElement) {
		var windowWidth = $window.innerWidth;
		var windowHeight = $window.innerHeight;

		var thirdOfWindowHeight = windowHeight / 3;
		var p1 = {x: 0, y: 0};
		var p2 = {x: 0, y: windowHeight - thirdOfWindowHeight};
		var p3 = {x: windowWidth, y: thirdOfWindowHeight};
		var p4 = {x: windowWidth, y: windowHeight};

		var points = ''
		points += p1.x + ',' + p1.y + ' ';
		points += p2.x + ',' + p2.y + ' ';
		points += p3.x + ',' + p3.y + ' ';
		points += p4.x + ',' + p4.y;

		polygonElement.attr('points', points);
	}
	return {
		restrict: 'E',
		templateUrl: 'background-top.html',
		link: function ($scope, $element, $attributes) {
			var polygon = $element.find('polygon');
			draw($window, polygon);
			$window.addEventListener('resize', function () {
				draw($window, polygon);
			});

			var fillColor = '#AAAAAA';
			polygon.css('fill', fillColor);
		}
	};
}]);



/** 
 * Liam Howell
 * 02-02-2015
 */

// Config
var initialLeft,
	leftPercent,
	rightPercent;

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
function getBackgroundLeftPoint($window) {
	var windowHeight = $window.innerHeight;
	var leftHeight = windowHeight * leftPercent;
	return [
		0, // x
		leftHeight // y
	];
}

// Retrieve the right point of the background line, from the given $window.
function getBackgroundRightPoint($window) {
	var windowWidth = $window.innerWidth;
	var windowHeight = $window.innerHeight;
	var rightHeight = windowHeight * rightPercent;
	return [
		windowWidth, // x
		rightHeight // y
	];
}

// Retrieve the degrees of the slope from a given window.
function getBackgroundDegrees($window) {
	var p1 = getBackgroundLeftPoint($window);
	var p2 = getBackgroundRightPoint($window);
	var degrees = calculateSlope(p1, p2);
	return degrees;
}

// Determine if a given string ends with a semicolon;
function endsWithSemicolon(str) {
	return str.substr(str.length - 1) == ';';
}

// Extracts the first style name found in a given string.
function extractStyleName(stringToAdd) {
	var indexOfColon = stringToAdd.indexOf(':');
	// Does the string even contain a semicolon?
	if (indexOfColon < 1) {
		return -1;
	}
	return stringToAdd.substr(0, indexOfColon);
}

// Retrieve the value of the existing style we are trying to add (if it exists).
function getExistingStyle($element, stringToAdd) {
	//console.dir($element);
	var styleName = extractStyleName(stringToAdd);
	//console.dir(styleName);
	//console.dir($element.css(styleName));
}

// Add a given string to the given element (jqLite selector) without clobbering
// existing style string.
function addToElementStyle($element, stringToAdd) {
	var originalStyle = $element[0].style.cssText;
	getExistingStyle($element, stringToAdd);
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

// Retrieve the coordinates of the corner points of a given element.
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

// Get the given coordinates after applying a rotation to them.
function getRotatedCoordinates(points, pointOfRotation, degrees) {
	var result = [];
	for (var i = 0; i < points.length; i++) {
		result.push(calculateRotatedPoint(points[i], pointOfRotation, degrees));
	}
	return result;
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
		leftAdjustment -= initialLeft;	
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

// Return the given percentage string as a usable percent (e.g. 0.5).
// If the given string is a falsy value then the given default is returned,
// (which may be undefined).
function parsePercent(str, defaultValue) {
	if (str) {
		return parseFloat(str) / 100;
	} else {
		return defaultValue;
	}
}

// The name directive.
app.directive('rotatedBackground', ['$window', function ($window) {
	return {
		restrict: 'A',
		link: function ($scope, $element, $attributes) {
			// Set config data.
			initialLeft = $element[0].offsetLeft;
			leftPercent = parsePercent($attributes.leftpercent, 1 - 1/3);
			rightPercent = parsePercent($attributes.rightpercent, 1/3);
			// Apply the transformation right away.
			applyTransformation($window, $element);
			// And apply it whenever the window is resized.
			$window.addEventListener('resize', function () {
				applyTransformation($window, $element);
			});
		}
	};
}]);


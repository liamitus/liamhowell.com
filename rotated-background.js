/** 
 * Liam Howell
 * 02-08-2015
 */

// Config
var debuggingEnabled = true;
var initialLeft;
var leftPercent;
var rightPercent;
var initialPosition;

// Used by the debug function to capture line number.
function getErrorObject(){
   try { throw Error('') } catch(err) { return err; }
}

// Sends a debug message to console.
function d(msg) {
   if (!debuggingEnabled) {
      return;
   }

   // Get line number of calling function.
   var err = getErrorObject();
   var caller_line = err.stack.split("\n")[4];
   var index = caller_line.indexOf("at ");
   var clean = caller_line.slice(index+2, caller_line.length);
   
   if (arguments.length > 1) {
      console.warn(clean, arguments);
      return;
   }

   switch (typeof msg) {
      case 'undefined':
	 console.debug(clean);
	 break;
      case 'number':
      case 'string':
	 console.warn(msg + clean);
	 break;
      case 'object':
	 msg.__DEBUG_calledFrom__ = clean;
      default:
	 console.dir(msg);
   }
};

function placeDebugDivs(coordinates) {
   var size = 5;
   for (var i = 0; i < coordinates.length; i++) {
      var div = '<div style="position:absolute;' +
	 'width:' + size + 'px;height:' + size + 'px;' +
	 'top:' + coordinates[i][1] + 'px;left:' +
	 coordinates[i][0] + 'px;' +
	 'background:indigo;z-index:10;"></div>';
      document.body.innerHTML += div;
   }
}

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
function applyRotation($element, degrees) {
   applyCSSRotation($element, degrees);
   applyToChildren($element, function ($child) {
      applyCSSRotation($child, -degrees);
   });
}

// Calculate the distance between the bottom-left coordinate point and the
// edge of the screen, as a number representing the number of pixels.
function calculateLeftAdjustment($element, points) {
   return $element[0].offsetLeft - points[2][0];
}

// Apply the left adjustment to keep the bottom left corner in place.
// Applies counter adjustment to the children elements.
function applyLeftAdjustment($element, leftAdjustment) {
   //d(leftAdjustment);
   addToElementStyle($element, 'left: ' + leftAdjustment + 'px');
   //addToElementStyle($element, 'padding-left: ' + (-leftAdjustment) + 'px');
   applyToChildren($element, function ($child) {
      leftAdjustment -= initialLeft;	
      addToElementStyle($child, 'padding-left: ' + (-leftAdjustment) + 'px');
   });
}

// Takes an $element and radians to calculate and apply the left adjustment
// required to have the bottom left corner be in line with the left edge of the
// window.
function leftAdjustment($element, radians) {
   var coordinates = getCornerPoints($element);
   var rotatedCoordinates =
      getRotatedCoordinates(coordinates, coordinates[0], radians);
   var pixels = calculateLeftAdjustment($element, rotatedCoordinates);
   applyLeftAdjustment($element, pixels);
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

function applyHeightAdjustment($window, $element) {
   var element = $element[0];
   var originalLocation = getCornerPoints($element);
   d(originalLocation);
   var heightDifference = originalLocation[0][1];
   if (heightDifference > 0) {
      d(element);
      element.style.top = 0;
      element.style.paddingTop = heightDifference + 'px';
   }
}

function calculateWidthAdjustment($window, $element, rotatedPoints) {
   var missingWidth = $window.innerWidth - rotatedPoints[1][0];
   return $element[0].offsetWidth + missingWidth;
}

// Apply the rotation, and makes adjustments to the position and width to keep
// the corners of the element in the same place prior to rotation.
function applyTransformation($window, $element) {
   var degrees = getBackgroundDegrees($window);
   var radians = degrees * (Math.PI/180);

   //applyHeightAdjustment($window, $element);
   leftAdjustment($element, radians);
   applyWidthAdjustment($window, $element);
   applyRotation($element, degrees);
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
	 leftPercent = 1 - parsePercent($attributes.leftpercent, 1/3);
	 rightPercent = parsePercent($attributes.rightpercent, 1/3);
	 //degrees = parseFloat($attributes.angle);
	 initialPosition = getCornerPoints($element);

	 // Apply the transformation right away.
	 applyTransformation($window, $element);
	 // And apply it whenever the window is resized.
	 $window.addEventListener('resize', function () {
	    applyTransformation($window, $element);
	 });
      }
   };
}]);


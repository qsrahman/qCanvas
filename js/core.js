"use strict";

// Keyboard interaction
var keycode = {
  ENTER     : 13,
  COMMAND   : 15,
  SHIFT     : 16,
  CONTROL   : 17,
  ESCAPE    : 27,
  SPACE     : 32,
  PAGE_UP   : 33,
  PAGE_DOWN	: 34,
  END       : 35,
  HOME      : 36,
  LEFT      : 37,
  UP        : 38,
  RIGHT     : 39,
  DOWN      : 40
};

// Object that contains our utility functions.
// Attached to the window object which acts as the global namespace.
window.core = {};

// Keeps track of the current mouse position, relative to an element.
window.core.captureMouse = function(element) {
    var mouse = {x: 0, y: 0, event: null};

    element.addEventListener('mousemove', function(event) {
        var rect = element.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        mouse.event = event;
    }, false);

    return mouse;
};

// return a random color like "#FFFFFF"
window.core.randomColor = function() {
  var hexR = Math.floor(Math.random()*256).toString(16),
      hexG = Math.floor(Math.random()*256).toString(16),
      hexB = Math.floor(Math.random()*256).toString(16);

  // making sure single character values are prepended with a "0"
  if (hexR.length == 1) {
    hexR = "0" + hexR;
  }

  if (hexG.length == 1) {
    hexG = "0" + hexG;
  }

  if (hexB.length == 1) {
    hexB = "0" + hexB;
  }

  // creating the hex value by concatenatening the string values
  var hexColor = "#" + hexR + hexG + hexB;
  return hexColor.toUpperCase();
};

window.core.rgb2hex = function (r, g, b) {
    r = (r < 10 ? '0' : '') + r.toString(16);
    g = (g !== undefined) ? (g < 10 ? '0' : '') + g.toString(16) : r;
    b = (b !== undefined) ? (b < 10 ? '0' : '') + b.toString(16) : r;
    return '#' + r + g + b;
};

// Determine if a rectangle contains the coordinates (x,y) within it's boundaries.
// rect Object with properties: x, y, width, height.
window.core.containsPoint = function (rect, x, y) {
  return !(x < rect.x ||
           x > rect.x + rect.width ||
           y < rect.y ||
           y > rect.y + rect.height);
};

// Determine if two rectangles overlap.
// rectA Object with properties: x, y, width, height.
// rectB Object with properties: x, y, width, height.
window.core.intersects = function (rectA, rectB) {
  return !(rectA.x + rectA.width < rectB.x ||
           rectB.x + rectB.width < rectA.x ||
           rectA.y + rectA.height < rectB.y ||
           rectB.y + rectB.height < rectA.y);
};

// Returns distance between two points
window.core.distance = function (x1, y1, x2, y2) {
  var dx = x2 - x1,
      dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
};

window.core.distanceSq = function (x1, y1, x2, y2) {
    var dx = x2 - x1,
        dy = y2 - y1;

    return (dx * dx + dy * dy);
};

// I use clamp instead of constrain cos easier to type :P
window.core.clamp = function (value, min, max) {
  // return value < min ? min : (value > max ? max : value);
  return Math.max(min, Math.min(value, max));
};

window.core.inRange = function (value, min, max) {
  return value >= min && value <= max;
};

window.core.lerp = function (start, stop, value) {
  return start + (stop - start) * value;
};

// check for division by zero???
window.core.normalize = function (value, min, max) {
//  var t = (value - min) / (max - min);
//  return t < 0 ? 0 : t > 1 ? 1 : t;
  return core.clamp((value - min) / (max - min), 0, 1);
};

//check for division by zero???
window.core.map = function (value, inputMin, inputMax, outputMin, outputMax) {
  return ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
};

// Returns a random number between min and max
window.core.random = function (min, max) {
  return Math.random() * (max - min) + min;
};

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
window.core.randomInt = function (min, max) {
  //return Math.floor(Math.random() * (max - min + 1)) + min;
  return ~~(Math.random() * (max - min + 1)) + min;
};

// Random float from <0, 1> with 16 bits of randomness
// (standard Math.random() creates repetitive patterns when applied over larger space)
window.core.random16 = function () {
  return (65280 * Math.random() + 255 * Math.random()) / 65535;
};

window.core.sign = function (x) {
  return ((x < 0) ? -1 : ( x > 0) ? 1 : 0);
};

window.core.floor = function (n) {
     return ~~n;
};

window.core.ceil = function (n) {
    var t = ~~n;
    return t === n ? n : (n > 0) ? (t + 1) : (t - 1)
};

// This is a direct translation to javascript from the reference
// Java implementation of the improved perlin function
// (see http://mrl.nyu.edu/~perlin/noise/)
// The original Java implementation is Copyright 2002 Ken Perlin

(function() {
   var p = new Array(512),
       permutation = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208, 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253, 19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

   for (var i=0; i < 256 ; i++)
     p[256+i] = p[i] = permutation[i];

   function noise(x, y, z) {
      var X = Math.floor(x) & 255,
          Y = Math.floor(y) & 255,
          Z = Math.floor(z) & 255;
      x -= Math.floor(x);
      y -= Math.floor(y);
      z -= Math.floor(z);

      var u = fade(x),
          v = fade(y),
          w = fade(z);
      var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,
          B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;

      return lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),
                                     grad(p[BA  ], x-1, y  , z   )),
                             lerp(u, grad(p[AB  ], x  , y-1, z   ),
                                     grad(p[BB  ], x-1, y-1, z   ))),
                     lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),
                                     grad(p[BA+1], x-1, y  , z-1 )),
                             lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                                     grad(p[BB+1], x-1, y-1, z-1 ))));
   }

   function fade(t) {
     return t * t * t * (t * (t * 6 - 15) + 10);
   }

   function lerp(t, a, b) {
     return a + t * (b - a);
   }

   function grad(hash, x, y, z) {
      var h = hash & 15;
      var u = h<8 ? x : y,
          v = h<4 ? y : h==12||h==14 ? x : z;
      return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
   }

   window.core.noise = noise;
})();

'use strict';

function qCanvas(config) {
	var me = this;

	this.canvas = null;
	this.context = null;

	this.width = config.width || 640;
	this.height = config.height || 480;

	this.setup = config.setup;
	this.update = config.update;
	this.draw = config.draw;

	this.mouseUp = config.mouseUp;
	this.mouseDown = config.mouseDown;
	this.mouseMove = config.mouseMove;

	this.keyUp = config.keyUp;
	this.keyDown = config.keyDown;
	this.keyPress = config.keyPress;

	this.fps = config.fps || 60;
	this.animate = config.animate || false;

	this.clearColor = null;

	this.isDown = false;
	this.fullscreen = config.fullscreen || false;

	this.mouse = {x: 0, y: 0, px: 0, py: 0, event: null};

	this.deltaX	= 0;
	this.deltaY	= 0;

	this.key = 0;
	this.keys = {};
	this.keyCode = 0;

	this.clear = function() {
		var ctx = this.ctx;

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		if (this.clearColor === null) {
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		} else {
			ctx.fillStyle = this.clearColor;
			ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}

		ctx.restore();

		return this;
	};

	this.size = function(w, h) {
		if (typeof w !== 'number' || typeof h !== 'number')
			throw 'Illegal numbers for width or height.';

		try {
			this.width = this.canvas.width = parseInt(w, '10');
			this.height = this.canvas.height = parseInt(h, '10');
		} catch(err) {
			console.error(err);
		}

		return this;
	};

	this.line = function(x1, y1, x2, y2, color, lwidth) {
		var ctx = this.ctx,
			l = arguments.length;

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);

		if (l > 4) ctx.strokeStyle = color;
		if (l > 5) ctx.lineWidth = lwidth;

		ctx.stroke();

		return this;
	};

	this.createCanvas = function(w, h) {
		if (arguments.length !== 2) {
			w = this.width;
			h = this.height;
		}

		var c = document.createElement('canvas'),
			x;

		c.width = w;
		c.height = h;

		x = c.getContext('2d');

		return {canvas: c, ctx: x, context: x, width: w, height: h, centerX: w * 0.5, centerY: h * 0.5};
	}

	function _getMousePos(e) {
		var r = me.canvas.getBoundingClientRect();

		me.mouse.px = me.mouse.x;
		me.mouse.py = me.mouse.y;

		me.mouse.x = e.clientX - r.left;
		me.mouse.y = e.clientY - r.top;

		me.mouse.event = e;
	}

	function _mouseMove(e) {
		_getMousePos(e);

		if(me.mouseMove)
			me.mouseMove(me);
	}

	function _mouseUp(e) {
		_getMousePos(e);

		if(me.isDown === true) {
			me.isDown = false;
			if(me.mouseUp)
				me.mouseUp(me);
		}
	}

	function _mouseDown(e) {
		_getMousePos(e);

		me.isDown = true;

		if(me.mouseDown)
			me.mouseDown(me);
	}

	function _keyDown(e) {
		me.keyCode = e.keyCode;
		me.key = String.fromCharCode(me.keyCode);
		me.keys[me.keyCode] = true;
		if(me.keyDown)
			me.keyDown(me);
	}

	function _keyUp(e) {
		me.keyCode = e.keyCode;
		me.key = String.fromCharCode(me.keyCode);
		delete me.keys[me.keyCode];
		if(me.keyUp)
			me.keyUp(me);
	}

	function _keyPress(e) {
		me.keyCode = e.keyCode;
		me.key = String.fromCharCode(me.keyCode);
		if(me.keyPress)
			me.keyPress(me);
	}

	function _resize() {
		if (me.fullscreen) {
			var w = window.innerWidth,
				h = window.innerHeight;

			if (me.canvas.width !== w)
				me.width = me.canvas.width = w;

			if (me.canvas.height !== h)
				me.height = me.canvas.height = h;
		}
	}

	var then;

	function _update() {
		var now = new Date().getTime(),
			dt = (now - then) * (me.fps / 1000);

		if(me.animate) {
			if(me.update) me.update(me, dt);
			if (me.draw) me.draw(me, dt);
		}

		then = now; // - (dt % interval);
		requestAnimationFrame(_update, me.canvas);
	}

	this.canvas = document.getElementById(config.canvasid || 'canvas');
	this.context = this.ctx = this.canvas.getContext('2d');

	if(this.fullscreen) {
		this.canvas.style.left = '0';
		this.canvas.style.top = '0';

		this.size(window.innerWidth, window.innerHeight);
	}
	else {
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}

	this.canvas.addEventListener('mouseup', _mouseUp, false);
	this.canvas.addEventListener('mousemove', _mouseMove, false);
	this.canvas.addEventListener('mousedown', _mouseDown, false);

	document.addEventListener('keyup', _keyUp, false);
	document.addEventListener('keydown', _keyDown, false);
	document.addEventListener('keypress', _keyPress, false);

	window.addEventListener('resize', _resize, false);

	(function() {
		if(me.setup) {
			me.setup(me);
		}

		then = new Date().getTime();
		_update();
	})();
}

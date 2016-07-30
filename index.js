module.exports = exports = create;

function create(doc) {
	return new din(doc);
}

function din(doc) {
	const margin = mm2pt(7.12);

	this.doc = doc;
	this.margins = {
		left: margin,
		top: margin,
		right: this.doc.page.width - margin,
		bottom: this.doc.page.height - margin
	}
	this.stamp = {
		width: mm2pt(182.88),
		height: mm2pt(54.99),
		bottom: this.margins.bottom,
		right: this.margins.right
	}
	this.stamp.left = this.stamp.right - this.stamp.width;
	this.stamp.top = this.stamp.bottom - this.stamp.height;
}

din.prototype.draw = function() {
	return this.drawBorder().drawFrame();
};

din.prototype.drawFrame = function() {

	/*
		    X0 X1   X2  X3 X4  X5  X6      X7       X8    X9    X10    X11
		 Y0 ┌──────────────┬───────┬───────┬──────────────┬────────────┐
		 Y1 |              |       |       ├──────────────┴────────────┤
		    |              |       |       |                           |
		 Y2 ├──┬────┬───┬──┼───┬───┼───────┼───────────────────────────┤
		 Y3 ├──┼────┼───┼──┼───┼───┼───────┤                           |
		 Y4 ├──┼────┼───┼──┼───┼───┼───────┤                           |
		 Y5 ├──┼────┼───┼──┼───┼───┼───────┤                           |
		 Y6 ├──┼────┼───┼──┼───┴───┼───────┤                           |
		 Y7 ├──┼────┼───┼──┼───────┴───────┼────────────────────┬──────┤
		 Y8 ├──┼────┼───┼──┤               |                    |      |
		 Y9 ├──┼────┼───┼──┤               |                    ├──────┤
		Y10 ├──┼────┼───┼──┼───────────────┼────────┬───────────┴──────┤
		Y11 └──┴────┴───┴──┴───────────────┴────────┴──────────────────┘
		    X0 X1   X2  X3 X4  X5  X6      X7       X8    X9    X10    X11
	*/


	const X0 = this.stamp.left;
	const X1 = X0 + mm2pt(7.6);
	const X2 = X1 + mm2pt(26.57);
	const X3 = X2 + mm2pt(13.22);
	const X4 = X3 + mm2pt(7.76);
	const X5 = X4 + mm2pt(10.44);
	const X6 = X5 + mm2pt(15.84);
	const X7 = X6 + mm2pt(18.49);
	const X8 = X7 + mm2pt(41.53);
	const X9 = this.stamp.right - mm2pt(26.74);
	const X10 = this.stamp.right - mm2pt(15.75);
	const X11 = this.stamp.right;

	const rowHeight = mm2pt(4.19);

	const Y0 = this.stamp.top;
	const Y1 = Y0 + mm2pt(6.44);
	const Y2 = Y0 + mm2pt(17);
	const Y3 = Y2 + rowHeight;
	const Y4 = Y3 + rowHeight;
	const Y5 = Y4 + rowHeight;
	const Y6 = Y5 + rowHeight;
	const Y7 = Y6 + rowHeight;
	const Y8 = Y7 + rowHeight;
	const Y9 = Y8 + rowHeight;
	const Y10 = Y9 + rowHeight;
	const Y11 = this.stamp.bottom;

	this.doc
		.moveTo(this.stamp.right, this.stamp.top)
		.lineTo(this.stamp.left, this.stamp.top)
		.lineTo(this.stamp.left, this.stamp.bottom)
		.stroke();

	// Horizontal lines

	this.line( X7,  Y1, X11,  Y1)
		.line( X0,  Y2, X11,  Y2)
		.line( X0,  Y3,  X7,  Y3)
		.line( X0,  Y4,  X7,  Y4)
		.line( X0,  Y5,  X7,  Y5)
		.line( X0,  Y6,  X7,  Y6)
		.line( X0,  Y7, X11,  Y7)
		.line( X0,  Y8,  X4,  Y8)
		.line( X0,  Y9,  X4,  Y9)
		.line(X10,  Y9, X11,  Y9)
		.line( X0, Y10, X11, Y10);

	// Vertical lines

	this.line( X1,  Y2,  X1, Y11)
		.line( X2,  Y2,  X2, Y11)
		.line( X3,  Y2,  X3, Y11)
		.line( X4,  Y0,  X4, Y11)
		.line( X5,  Y2,  X5,  Y6)
		.line( X6,  Y0,  X6,  Y7)
		.line( X7,  Y0,  X7, Y11)
		.line( X8, Y10,  X8, Y11)
		.line( X9,  Y0,  X9,  Y1)
		.line(X10,  Y7, X10, Y10);

	return this;
}

din.prototype.areas = function() {
	/*
		A ──────────── e ─────────── B
		│                            │
		│                            │
		│                            │
		b              ┌──────────── C
		│              │             │
		E ──────────── D ────────────┘

		Top area is ABCb described as AC vector.
		Left area is AeDE described as AD vector.
	 */
	return {
		top: area(this.margins.left, this.margins.top, this.margins.right, this.stamp.top),
		left: area(this.margins.left, this.margins.top, this.stamp.left, this.margins.bottom)
	};
}

din.prototype.line = function(x1, y1, x2, y2) {
	this.doc.moveTo(x1, y1).lineTo(x2, y2).stroke();
	return this;
}

din.prototype.drawBorder = function() {
	this.doc
		.moveTo(this.margins.left, this.margins.top)
		.lineTo(this.margins.left, this.margins.bottom)
		.lineTo(this.margins.right, this.margins.bottom)
		.lineTo(this.margins.right, this.margins.top)
		.lineTo(this.margins.left, this.margins.top)
		.stroke();

	return this;
}

function area(x1, y1, x2, y2) {
	var result = {
		left: Math.min(x1, x2),
		right: Math.max(x1, x2),
		top: Math.min(y1, y2),
		bottom: Math.max(y1, y2),
		width: Math.abs(x2-x1),
		height: Math.abs(y2-y1)
	}
	result.fit = [result.width, result.height];

	return result;
}

function mm2pt(mm) {
	const DPI = 72;
	const MMPI = 25.4;

	return mm * DPI / MMPI;
}

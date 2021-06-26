import { CANVAS_CTX } from "./canvas";

/**
 * Draws image onto canvas.
 *
 * Crops image using sx, sy, sw, sh.
 * Scales image using scaleX, scaleY.
 * Flips image if flip.
 * Rotates image using angle.
 * Draws image using dx, dy.
 *
 * @param {Image} opts.img - Source image.
 * @param {int} [opts.sx=0] - Source x.
 * @param {int} [opts.sy=0] - Source y.
 * @param {int} [opts.sw=opts.img.width-opts.sx] - Source width.
 * @param {int} [opts.sh=opts.img.height-opts.sy] - Source height.
 * @param {int} [opts.dx=0] - Destination x.
 * @param {int} [opts.dy=0] - Destination y.
 * @param {int} [opts.dw=opts.sw] - Destination width (prefer scaleX).
 * @param {int} [opts.dh=opts.sh] - Destination height (prefer scaleY).
 * @param {bool} [opts.flipped=false] - Flipped horizontally.
 * @param {float} [opts.scaleX=1] - Scale x.
 * @param {float} [opts.scaleY=1] - Scale y.
 * @param {int} [opts.angle=0] - Degrees clockwise rotation.
 * @param {int} [opts.rx=opts.dw*opts.scaleX/2] - Center x of rotation.
 * @param {int} [opts.ry=opts.dh*opts.scaleY/2] - Center y of rotation.
 * @param {float} [opts.alpha=1] - Opacity.
 */
function DRAW_IMAGE(opts = {}) {
  const img = opts.img;

  if (!img) {
    return;
  }

  const sx = !("sx" in opts) ? 0 : opts.sx;
  const sy = !("sy" in opts) ? 0 : opts.sy;
  const sw = !("sw" in opts) ? img.width - sx : opts.sw;
  const sh = !("sh" in opts) ? img.height - sy : opts.sh;

  const dx = !("dx" in opts) ? 0 : opts.dx;
  const dy = !("dy" in opts) ? 0 : opts.dy;
  const dw = !("dw" in opts) ? sw : opts.dw;
  const dh = !("dh" in opts) ? sh : opts.dh;

  const flipped = !("flipped" in opts) ? false : opts.flipped;
  const angle = !("angle" in opts) ? 0 : opts.angle;
  const alpha = !("alpha" in opts) ? 1 : opts.alpha;
  const scaleX = !("scaleX" in opts) ? 1 : opts.scaleX;
  const scaleY = !("scaleY" in opts) ? 1 : opts.scaleY;

  const effectiveWidth = dw * scaleX;
  const effectiveHeight = dh * scaleY;

  const rx = !("rx" in opts) ? effectiveWidth / 2 : opts.rx;
  const ry = !("ry" in opts) ? effectiveHeight / 2 : opts.ry;

  CANVAS_CTX.save();

  CANVAS_CTX.globalAlpha = alpha;

  CANVAS_CTX.translate(dx + rx, dy + ry);
  CANVAS_CTX.rotate(((angle % 360) * Math.PI) / 180);
  CANVAS_CTX.translate(-rx, -ry);

  if (!!flipped) {
    CANVAS_CTX.translate((img.width * scaleX * sw) / img.width, 0);
    CANVAS_CTX.scale(-1, 1);
  }

  CANVAS_CTX.drawImage(
    img,
    sx,
    sy,
    sw,
    sh,
    0,
    0,
    effectiveWidth,
    effectiveHeight
  );

  CANVAS_CTX.restore();
}

/**
 * Draws line onto canvas.
 *
 * @param {int} [opts.x1=0] - Destination x1.
 * @param {int} [opts.y1=0] - Destination y1.
 * @param {int} [opts.x2=0] - Destination x2.
 * @param {int} [opts.y2=0] - Destination y2.
 * @param {float} [opts.width=1] - Thickness.
 * @param {float} [opts.alpha=1] - Opacity.
 * @param {string] [opts.color='#000000'] - Color.
 */
function DRAW_LINE(opts = {}) {
  const x1 = opts.x1 || 0;
  const y1 = opts.y1 || 0;
  const x2 = opts.x2 || 0;
  const y2 = opts.y2 || 0;
  const alpha = opts.alpha || 1;
  const color = opts.color || "#000000";
  const width = opts.width || 1;

  CANVAS_CTX.save();
  CANVAS_CTX.beginPath();
  CANVAS_CTX.moveTo(x1, y1);
  CANVAS_CTX.lineTo(x2, y2);
  CANVAS_CTX.globalAlpha = alpha;
  CANVAS_CTX.strokeStyle = color;
  CANVAS_CTX.lineWidth = width;
  CANVAS_CTX.stroke();
  CANVAS_CTX.restore();
}

/**
 * Draws rectangle onto canvas.
 *
 * @param {int} [opts.x=0] - Destination x.
 * @param {int} [opts.y=0] - Destination y.
 * @param {int} [opts.width=0] - Width.
 * @param {int} [opts.height=0] - Height.
 * @param {int} [opts.angle=0] - Degrees clockwise rotation.
 * @param {float} [opts.alpha=1] - Opacity.
 * @param {string] [opts.color='#000000'] - Color.
 */
function DRAW_RECT(opts = {}) {
  const x = opts.x || 0;
  const y = opts.y || 0;
  const width = opts.width || 0;
  const height = opts.height || 0;
  const angle = opts.angle || 0;
  const alpha = opts.alpha || 1;
  const color = opts.color || "#000000";

  CANVAS_CTX.save();

  CANVAS_CTX.globalAlpha = alpha;
  CANVAS_CTX.fillStyle = color;
  CANVAS_CTX.translate(x, y);
  CANVAS_CTX.rotate(((angle % 360) * Math.PI) / 180);
  CANVAS_CTX.fillRect(0, 0, width, height);

  CANVAS_CTX.restore();
}

/**
 * Draws text onto canvas.
 *
 * @param {string} [opts.text=''] - Text.
 * @param {int} [opts.x=0] - Destination x.
 * @param {int} [opts.y=0] - Destination y.
 * @param {string} [opts.color='#000000'] - Color.
 * @param {string} [opts.fontWeight=''] - Font weight, such as bold or 900.
 * @param {string} [opts.fontStyle=''] - Font style, such as italic.
 * @param {int} [opts.fontSize=12] - Font size.
 * @param {string} [opts.fontFamily='Arial'] - Font family.
 * @param {string} [opts.align='left'] - Alignment relative to destination x.
 */
function DRAW_TEXT(opts = {}) {
  const text = opts.text || "";
  const x = opts.x || 0;
  const y = opts.y || 0;
  const color = opts.color || "#000000";
  const fontWeight = opts.fontWeight || "";
  const fontStyle = opts.fontStyle || "";
  const fontSize = opts.fontSize || 12;
  const fontFamily = opts.fontFamily || "Arial";
  const textAlign = opts.align || "left";

  CANVAS_CTX.save();

  CANVAS_CTX.textBaseline = "top";
  CANVAS_CTX.fillStyle = color;
  CANVAS_CTX.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
  CANVAS_CTX.textAlign = textAlign;

  CANVAS_CTX.fillText(text, x, y);

  CANVAS_CTX.restore();
}

/**
 * Measures text.
 *
 * @param {string} [opts.text=''] - Text.
 * @param {string} [opts.color='#000000'] - Color.
 * @param {string} [opts.fontWeight=''] - Font weight, such as bold or 900.
 * @param {string} [opts.fontStyle=''] - Font style, such as italic.
 * @param {int} [opts.fontSize=12] - Font size.
 * @param {string} [opts.fontFamily='Arial'] - Font family.
 * @return {TextMetrics} Text measurements given options.
 */
function MEASURE_TEXT(opts = {}) {
  const text = opts.text || "";
  const color = opts.color || "#000000";
  const fontWeight = opts.fontWeight || "";
  const fontStyle = opts.fontStyle || "";
  const fontSize = opts.fontSize || 12;
  const fontFamily = opts.fontFamily || "Arial";

  CANVAS_CTX.save();

  CANVAS_CTX.textBaseline = "top";
  CANVAS_CTX.fillStyle = color;
  CANVAS_CTX.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;

  const textMetrics = CANVAS_CTX.measureText(text);

  CANVAS_CTX.restore();

  return textMetrics;
}

export { DRAW_IMAGE, DRAW_LINE, DRAW_RECT, DRAW_TEXT, MEASURE_TEXT };

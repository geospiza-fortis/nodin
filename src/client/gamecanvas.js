class GameCanvas {
  constructor(gameWrapper) {
    this.scaleX = 1;
    this.scaleY = 1;
    this.mouseX = 0;
    this.mouseY = 0;
    this.clicked = false;
    this.rightClicked = false;
    this.focusGame = false;
    this.focusInput = false;
    this.scrolledUp = false;
    this.scrolledDown = false;
    this.keys = {
      esc: 27,
      f1: 112,
      f2: 113,
      f3: 114,
      f4: 115,
      f5: 116,
      f6: 117,
      f7: 118,
      f8: 119,
      f9: 120,
      f10: 121,
      f11: 122,
      f12: 123,
      tilde: 192,
      1: 49,
      2: 50,
      3: 51,
      4: 52,
      5: 53,
      6: 54,
      7: 55,
      8: 56,
      9: 57,
      0: 48,
      minus: 173,
      plus: 61,
      q: 81,
      w: 87,
      e: 69,
      r: 82,
      t: 84,
      y: 89,
      u: 85,
      i: 73,
      o: 79,
      p: 80,
      "[": 219,
      "]": 221,
      pipe: 220,
      a: 65,
      s: 83,
      d: 68,
      f: 70,
      g: 71,
      h: 72,
      j: 74,
      k: 75,
      l: 76,
      colon: 59,
      quote: 222,
      enter: 13,
      shift: 16,
      z: 90,
      x: 88,
      c: 67,
      v: 86,
      b: 66,
      n: 78,
      m: 77,
      comma: 188,
      period: 190,
      ctrl: 17,
      alt: 18,
      space: 32,
      insert: 45,
      home: 36,
      pageup: 33,
      delete: 46,
      end: 35,
      pagedown: 34,
      up: 38,
      left: 37,
      down: 40,
      right: 39,
      num0: 96,
    };
    this.pressedKeys = {};

    this.gameWrapper = gameWrapper;
    this.game = gameWrapper.querySelector("#game");
    this.context = this.game.getContext("2d");

    this.listenMouse();
    this.listenKeyboard();
  }

  listenMouse() {
    this.gameWrapper.addEventListener("mousemove", (e) => {
      const rectangle = this.gameWrapper.getBoundingClientRect();
      this.mouseX = (e.clientX - rectangle.left) / this.scaleX;
      this.mouseY = (e.clientY - rectangle.top) / this.scaleY;
    });
    this.gameWrapper.addEventListener("mousedown", (e) => {
      if (e.which === 1) {
        this.clicked = true;
      } else if (e.which === 3) {
        this.rightClicked = true;
      }
    });
    this.gameWrapper.addEventListener("mouseup", (e) => {
      if (e.which === 1) {
        this.clicked = false;
      } else if (e.which === 3) {
        this.rightClicked = false;
      }
    });
    this.gameWrapper.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    this.gameWrapper.addEventListener("mouseout", (e) => {
      const stillHoveringGameWrapper =
        !!e.relatedTarget && e.relatedTarget.parentNode === this.gameWrapper;
      if (!stillHoveringGameWrapper) {
        this.clicked = false;
        this.rightClicked = false;
      }
    });
    window.addEventListener("mousedown", (e) => {
      this.focusGame = e.target === this.game;
    });
    this.gameWrapper.addEventListener("DOMMouseScroll", (e) => {
      // firefox
      this.scrolledUp = e.detail < 0;
      this.scrolledDown = e.detail > 0;
    });
    this.gameWrapper.addEventListener("mousewheel", (e) => {
      // chrome
      this.scrolledUp = e.wheelDelta > 0;
      this.scrolledDown = e.wheelDelta < 0;
    });
  }
  listenKeyboard() {
    window.onkeydown = (e) => {
      if (this.focusGame && !this.focusInput) {
        e.preventDefault();
        this.pressedKeys[e.keyCode] = true;
      }
    };
    window.onkeyup = (e) => {
      if (this.focusGame && !this.focusInput) {
        e.preventDefault();
        this.pressedKeys[e.keyCode] = false;
      }
    };
  }
  isKeyDown(key) {
    return !!this.pressedKeys[this.keys[key]] || !!this.pressedKeys[key];
  }
  resetMousewheel() {
    this.scrolledUp = false;
    this.scrolledDown = false;
  }
  releaseFocusInput() {
    this.pressedKeys[this.keys.enter] = false;
    this.game.focus();
  }

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
  drawImage(opts = {}) {
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

    this.context.save();

    this.context.globalAlpha = alpha;

    this.context.translate(dx + rx, dy + ry);
    this.context.rotate(((angle % 360) * Math.PI) / 180);
    this.context.translate(-rx, -ry);

    if (!!flipped) {
      this.context.translate((img.width * scaleX * sw) / img.width, 0);
      this.context.scale(-1, 1);
    }

    this.context.drawImage(
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

    this.context.restore();
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
  drawLine(opts = {}) {
    const x1 = opts.x1 || 0;
    const y1 = opts.y1 || 0;
    const x2 = opts.x2 || 0;
    const y2 = opts.y2 || 0;
    const alpha = opts.alpha || 1;
    const color = opts.color || "#000000";
    const width = opts.width || 1;

    this.context.save();
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.globalAlpha = alpha;
    this.context.strokeStyle = color;
    this.context.lineWidth = width;
    this.context.stroke();
    this.context.restore();
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
  drawRect(opts = {}) {
    const x = opts.x || 0;
    const y = opts.y || 0;
    const width = opts.width || 0;
    const height = opts.height || 0;
    const angle = opts.angle || 0;
    const alpha = opts.alpha || 1;
    const color = opts.color || "#000000";

    this.context.save();

    this.context.globalAlpha = alpha;
    this.context.fillStyle = color;
    this.context.translate(x, y);
    this.context.rotate(((angle % 360) * Math.PI) / 180);
    this.context.fillRect(0, 0, width, height);

    this.context.restore();
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
  drawText(opts = {}) {
    const text = opts.text || "";
    const x = opts.x || 0;
    const y = opts.y || 0;
    const color = opts.color || "#000000";
    const fontWeight = opts.fontWeight || "";
    const fontStyle = opts.fontStyle || "";
    const fontSize = opts.fontSize || 12;
    const fontFamily = opts.fontFamily || "Arial";
    const textAlign = opts.align || "left";

    this.context.save();

    this.context.textBaseline = "top";
    this.context.fillStyle = color;
    this.context.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
    this.context.textAlign = textAlign;

    this.context.fillText(text, x, y);

    this.context.restore();
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
  measureText(opts = {}) {
    const text = opts.text || "";
    const color = opts.color || "#000000";
    const fontWeight = opts.fontWeight || "";
    const fontStyle = opts.fontStyle || "";
    const fontSize = opts.fontSize || 12;
    const fontFamily = opts.fontFamily || "Arial";

    this.context.save();

    this.context.textBaseline = "top";
    this.context.fillStyle = color;
    this.context.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;

    const textMetrics = this.context.measureText(text);

    this.context.restore();

    return textMetrics;
  }
}

export default GameCanvas;

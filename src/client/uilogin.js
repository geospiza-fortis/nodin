import WZManager from "./wzmanager";
import UICommon from "./uicommon";
import MapleInput from "./mapleinput";
import MapleMap from "./maplemap";
import GUIUtil from "./guiutil";
import Random from "./random";

const UILogin = {};

UILogin.initialize = async function () {
  await UICommon.initialize();
  const uiLogin = await WZManager.get("UI.wz/Login.img");

  this.firstUpdate = true;
  this.clicked = false;
  this.lastClickedPosition = {};
  this.activeButton = null;

  this.frameImg = uiLogin.Common.frame.nGetImage();

  this.inputUsn = null;
  this.inputPwd = null;

  this.loginButtonX = 223;
  this.loginButtonY = -85;
  this.loginButton = {
    stance: "normal",
    stances: uiLogin.Title.BtLogin.nChildren.reduce((stances, stance) => {
      stances[stance.nName] = stance.nChildren[0];
      return stances;
    }, {}),
    update: (msPerTick) => {},
    draw: (canvas, camera, lag, msPerTick, tdelta) => {
      const currentFrame = this.loginButton.stances[this.loginButton.stance];
      const currentImage = currentFrame.nGetImage();
      canvas.drawImage({
        img: currentImage,
        dx: this.loginButtonX - camera.x,
        dy: this.loginButtonY - camera.y,
      });
    },
    layer: 2,
  };
  // Login button appears above signboard and below effect
  MapleMap.objects.push(this.loginButton);

  const dice = uiLogin.NewChar.dice;
  this.dice = dice.nChildren;
  this.diceFrame = 0;
  this.diceX = 245;
  this.diceY = -1835;
  this.canClickDice = true;
  this.updateDice = false;
  this.diceDelay = 100;

  this.newCharStats = Random.generateDiceRollStats();
};

UILogin.doUpdate = function (msPerTick, camera, canvas) {
  if (this.firstUpdate) {
    this.inputUsn = new MapleInput(canvas, {
      x: 442,
      y: 240,
      width: 142,
      color: "#ffffff",
    });
    this.inputPwd = new MapleInput(canvas, {
      x: 442,
      y: 269,
      width: 142,
      color: "#ffffff",
      type: "password",
    });
    this.firstUpdate = false;
  }

  const mousePoint = { x: canvas.mouseX, y: canvas.mouseY };
  const clickedOnLastUpdate = this.clicked;
  const clickedOnThisUpdate = canvas.clicked;
  const releasedClick = clickedOnLastUpdate && !clickedOnThisUpdate;
  const lastActiveButton = this.activeButton;
  let currActiveButton = null;

  const loginButtonImage = this.loginButton.stances.normal.nGetImage();
  const loginButtonRect = {
    x: this.loginButtonX - camera.x,
    y: this.loginButtonY - camera.y,
    width: loginButtonImage.width,
    height: loginButtonImage.height,
  };
  const hoverLogin = GUIUtil.pointInRectangle(mousePoint, loginButtonRect);
  if (hoverLogin) {
    currActiveButton = this.loginButton;
  }

  const dice = this.dice[0];
  const diceImage = dice.nGetImage();
  const diceRect = {
    x: this.diceX - camera.x - dice.origin.nX,
    y: this.diceY - camera.y - dice.origin.nY,
    width: diceImage.width,
    height: diceImage.height,
  };
  const hoverDice = GUIUtil.pointInRectangle(mousePoint, diceRect);
  if (hoverDice) {
    currActiveButton = this.dice;
  }

  if (lastActiveButton !== currActiveButton) {
    this.activeButton = currActiveButton;

    // reset all buttons
    this.loginButton.stance = "normal";

    if (this.activeButton === this.loginButton) {
      UICommon.playMouseHoverAudio();
      this.loginButton.stance = "mouseOver";
    }
  }

  // update active button
  if (this.activeButton === this.loginButton) {
    const originallyClickedLoginButton = GUIUtil.pointInRectangle(
      this.lastClickedPosition,
      loginButtonRect
    );
    if (clickedOnThisUpdate) {
      const s = !originallyClickedLoginButton ? "mouseOver" : "pressed";
      this.loginButton.stance = s;
    } else {
      this.loginButton.stance = "mouseOver";
      const trigger = releasedClick && originallyClickedLoginButton;
      if (trigger) {
        UICommon.playMouseClickAudio();
        console.log("login!");
      }
    }
  } else if (this.activeButton === this.dice) {
    const originallyClickedDice = GUIUtil.pointInRectangle(
      this.lastClickedPosition,
      diceRect
    );
    if (releasedClick && originallyClickedDice && this.canClickDice) {
      this.canClickDice = false;
      this.updateDice = true;
      UICommon.playMouseClickAudio();
    }
  }

  if (this.updateDice) {
    this.diceDelay -= msPerTick;
    if (this.diceDelay <= 0) {
      this.diceFrame += 1;
      this.diceDelay = 100 - this.diceDelay;
    }
    const diceDoneRolling = this.diceFrame === 4;
    if (diceDoneRolling) {
      this.newCharStats = Random.generateDiceRollStats();
      this.diceFrame = 0;
      this.diceDelay = 100;
      this.updateDice = false;
      this.canClickDice = true;
    }
  }

  if (clickedOnThisUpdate) {
    if (!clickedOnLastUpdate) {
      this.lastClickedPosition = mousePoint;
    }
    this.clicked = true;
  } else {
    this.clicked = false;
  }

  UICommon.doUpdate(msPerTick, camera, canvas);
};

UILogin.doRender = function (canvas, camera, lag, msPerTick, tdelta) {
  const currDiceFrame = this.dice[this.diceFrame];
  const currDiceImage = currDiceFrame.nGetImage();
  canvas.drawImage({
    img: currDiceImage,
    dx: this.diceX - camera.x - currDiceFrame.origin.nX,
    dy: this.diceY - camera.y - currDiceFrame.origin.nY,
  });

  canvas.drawImage({
    img: this.frameImg,
    dx: 0,
    dy: 0,
  });

  canvas.drawText({
    text: "Ver. 0.62",
    fontWeight: "bold",
    x: 595,
    y: 13,
  });

  UICommon.doRender(canvas, camera, lag, msPerTick, tdelta);
};

UILogin.removeInputs = function () {
  if (this.inputUsn) this.inputUsn.remove();
  if (this.inputPwd) this.inputPwd.remove();
  this.inputUsn = null;
  this.inputPwd = null;
};

export default UILogin;

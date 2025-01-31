import WZManager from "./wzmanager";
import PLAY_AUDIO from "./playaudio";

const UICommon = {};

UICommon.initialize = async function () {
  const cursor = await WZManager.get("UI.wz/Basic.img/Cursor");

  this.cursorImg = cursor[0][0].nGetImage();
  this.cursorOrigin = cursor[0][0].origin;

  this.cursorDownImg = cursor[12][0].nGetImage();
  this.cursorDownOrigin = cursor[12][0].origin;

  const sounds = await WZManager.get("Sound.wz/UI.img");

  this.clickAudio = sounds.BtMouseClick.nGetAudio();
  this.hoverAudio = sounds.BtMouseOver.nGetAudio();
};

UICommon.playMouseClickAudio = function () {
  PLAY_AUDIO(this.clickAudio);
};

UICommon.playMouseHoverAudio = function () {
  PLAY_AUDIO(this.hoverAudio);
};

UICommon.doUpdate = function (msPerTick) {};

UICommon.doRender = function (canvas, camera, lag, msPerTick, tdelta) {
  const clicked = canvas.clicked;
  const cursorImg = !clicked ? this.cursorImg : this.cursorDownImg;
  const cursorOrigin = !clicked ? this.cursorOrigin : this.cursorDownOrigin;

  cursorImg.style.position = "absolute";
  cursorImg.style.zIndex = 4;
  cursorImg.style.pointerEvents = "none";
  cursorImg.style.left = `${canvas.mouseX - cursorOrigin.nX}px`;
  cursorImg.style.top = `${canvas.mouseY - cursorOrigin.nY}px`;

  !!this.currentCursor && this.currentCursor.remove();
  this.currentCursor = cursorImg;
  canvas.gameWrapper.appendChild(cursorImg);
};

export default UICommon;

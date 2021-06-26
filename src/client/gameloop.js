import Timer from "./timer";
import GameCanvas from "./gamecanvas";
import Camera from "./camera";
import StateManager from "./statemanager";

const REQUEST_ANIMATION_FRAME = (() => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      setTimeout(() => {
        callback && callback();
      }, 1000 / 60);
    }
  );
})();

const GameLoop = {
  fps: 60,
  msPerTick: 1000 / 60,
  lag: 0,
};

GameLoop.doUpdate = function (msPerTick, camera) {
  StateManager.doUpdate(msPerTick, camera);
};

GameLoop.doRender = function (canvas, camera, lag, msPerTick, tdelta) {
  canvas.drawRect({ x: 0, y: 0, width: 800, height: 600, color: "#000000" });
  StateManager.doRender(canvas, camera, lag, msPerTick, tdelta);
};

GameLoop.postRender = function () {
  GameCanvas.resetMousewheel();
};

GameLoop.gameLoop = function (highResTimestamp) {
  REQUEST_ANIMATION_FRAME(GameLoop.gameLoop);

  Timer.update();
  GameLoop.lag += Timer.delta;
  while (GameLoop.lag >= GameLoop.msPerTick) {
    GameLoop.lag -= GameLoop.msPerTick;
    Timer.tdelta += GameLoop.msPerTick;
    GameLoop.doUpdate(GameLoop.msPerTick, Camera);
  }
  GameLoop.doRender(
    GameCanvas,
    Camera,
    GameLoop.lag,
    GameLoop.msPerTick,
    Timer.tdelta
  );
  GameLoop.postRender();
};

export default GameLoop;

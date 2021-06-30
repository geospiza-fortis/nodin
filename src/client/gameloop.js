import Timer from "./timer";
import Camera from "./camera";
import StateManager from "./statemanager";

class GameLoop {
  fps = 60;
  msPerTick = 1000 / 60;
  lag = 0;
  constructor(gameCanvas) {
    this.gameCanvas = gameCanvas;
  }

  doUpdate(msPerTick, camera, canvas) {
    StateManager.doUpdate(msPerTick, camera, canvas);
  }

  doRender(canvas, camera, lag, msPerTick, tdelta) {
    canvas.drawRect({ x: 0, y: 0, width: 800, height: 600, color: "#000000" });
    StateManager.doRender(canvas, camera, lag, msPerTick, tdelta);
  }

  postRender(canvas) {
    canvas.resetMousewheel();
  }

  gameLoop(highResTimestamp) {
    requestAnimationFrame(() => this.gameLoop());

    Timer.update();
    this.lag += Timer.delta;
    while (this.lag >= this.msPerTick) {
      this.lag -= this.msPerTick;
      Timer.tdelta += this.msPerTick;
      // TODO: fix ordering of these variables
      this.doUpdate(this.msPerTick, Camera, this.gameCanvas);
    }
    this.doRender(
      this.gameCanvas,
      Camera,
      this.lag,
      this.msPerTick,
      Timer.tdelta
    );
    this.postRender(this.gameCanvas);
  }
}

export default GameLoop;

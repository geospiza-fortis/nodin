import GameLoop from "./gameloop";
import Timer from "./timer";
import GameCanvas from "./gamecanvas";
import WZManager from "./wzmanager";
import Camera from "./camera";
import MySocket from "./mysocket";
import StateManager from "./statemanager";
import LoginState from "./loginstate";

async function startGame() {
  GameCanvas.initialize();
  GameCanvas.drawRect({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    color: "#000000",
  });

  StateManager.initialize();
  WZManager.initialize();
  Camera.initialize();
  Timer.initialize();
  await MySocket.initialize();
  await StateManager.setState(LoginState);
  await LoginState.enterGame();

  GameLoop.gameLoop();
}

startGame();

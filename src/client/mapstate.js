import MapleMap from "./maplemap";
import GameCanvas from "./gamecanvas";
import MyCharacter from "./mycharacter";
import Camera from "./camera";
import UIMap from "./uimap";

const MapState = {};

MapState.initialize = async function () {
  await MyCharacter.load();
  MyCharacter.activate();
  // Henesys
  await MapleMap.load(100000000);
  await UIMap.initialize();

  const xMid = Math.floor(
    (MapleMap.boundaries.right + MapleMap.boundaries.left) / 2
  );
  const yMid = Math.floor(
    (MapleMap.boundaries.bottom + MapleMap.boundaries.top) / 2
  );

  MyCharacter.pos.x = xMid;
  MyCharacter.pos.y = yMid;
};

MapState.doUpdate = function (msPerTick) {
  if (!!MapleMap.doneLoading) {
    MapleMap.update(msPerTick);

    if (GameCanvas.isKeyDown("up")) MyCharacter.pos.up = true;
    if (GameCanvas.isKeyDown("down")) MyCharacter.pos.down = true;
    if (GameCanvas.isKeyDown("left")) MyCharacter.pos.left = true;
    if (GameCanvas.isKeyDown("right")) MyCharacter.pos.right = true;
    if (GameCanvas.isKeyDown("alt")) MyCharacter.pos.jump();
    MyCharacter.update(msPerTick);

    // now unset if the key is not pressed
    if (!GameCanvas.isKeyDown("up")) MyCharacter.pos.up = false;
    if (!GameCanvas.isKeyDown("down")) MyCharacter.pos.down = false;
    if (!GameCanvas.isKeyDown("left")) MyCharacter.pos.left = false;
    if (!GameCanvas.isKeyDown("right")) MyCharacter.pos.right = false;

    let x = Camera.x + 400;
    let y = Camera.y + 300;
    //Camera.lookAt(x, y);
    Camera.lookAt(MyCharacter.pos.x, MyCharacter.pos.y - 78);

    UIMap.doUpdate(msPerTick);
  }
};

MapState.doRender = function (canvas, camera, lag, msPerTick, tdelta) {
  if (!!MapleMap.doneLoading) {
    MapleMap.render(canvas, camera, lag, msPerTick, tdelta);
    if (!!MyCharacter.active) {
      MyCharacter.draw(canvas, camera, lag, msPerTick, tdelta);
    }
    if (!!MyCharacter.levelingUp) {
      drawLevelUp(MyCharacter);
    }
    UIMap.doRender(canvas, camera, lag, msPerTick, tdelta);
  }
};

export default MapState;

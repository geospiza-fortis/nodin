<script>
  import GameLoop from "./gameloop";
  import Timer from "./timer";
  import WZManager from "./wzmanager";
  import Camera from "./camera";
  import MySocket from "./mysocket";
  import StateManager from "./statemanager";
  import LoginState from "./loginstate";
  import MyCharacter from "./mycharacter";

  import Canvas from "./Canvas.svelte";
  import { onMount } from "svelte";

  let canvas;

  onMount(async () => {
    canvas.drawRect({
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
    let Loop = new GameLoop(canvas);
    Loop.gameLoop();
  });
</script>

<h1>
  nodin
  <a href="https://github.com/geospiza-fortis/nodin">geospiza's fork</a>
  __VERSION__
  <a href="https://github.com/geospiza-fortis/nodin/commit/__GIT_COMMIT__">
    (__GIT_COMMIT__)
  </a>
</h1>

<Canvas bind:canvas />

<h2>character</h2>
<label>Name <input type="text" bind:value={MyCharacter.name} /></label>

<script>
  import { onMount } from "svelte";
  import GameCanvas from "./gamecanvas";

  let gameWrapper;

  export let canvas;

  onMount(() => {
    canvas = new GameCanvas(gameWrapper);
  });
</script>

<div id="game-wrapper" bind:this={gameWrapper}>
  <canvas id="game" width="800" height="600" tabindex="-1" />
</div>

<style>
  #game-wrapper {
    /*border: 4px solid #000000;*/
    width: 800x;
    height: 600px;
    transform: scale(1, 1);
    z-index: 1;
    cursor: none;
  }

  #game {
    z-index: 2;
  }
</style>

<script>
  import { onMount } from "svelte";
  import GameCanvas from "./gamecanvas";

  let gameWrapper;
  let controlPanel;
  let menuContainer;

  export let canvas;

  onMount(() => {
    canvas = new GameCanvas(gameWrapper, controlPanel, menuContainer);
  });
</script>

<div id="game-wrapper" bind:this={gameWrapper}>
  <canvas id="game" width="800" height="600" tabindex="-1" />
</div>

<div id="control-panel" bind:this={controlPanel}>
  <div id="control-panel-bar">
    <div id="control-panel-x" />
  </div>

  <table>
    <tbody>
      <tr>
        <td>Width</td>
        <td><input id="input-w" placeholder="800" /></td>
      </tr>
      <tr>
        <td>Height</td>
        <td><input id="input-h" placeholder="600" /></td>
      </tr>
      <tr>
        <td>X</td>
        <td><input id="input-x" /></td>
      </tr>
      <tr>
        <td>Y</td>
        <td><input id="input-y" /></td>
      </tr>
    </tbody>
  </table>
</div>

<div id="menu-container" bind:this={menuContainer}>
  <div id="menu-icon">
    <span />
    <span />
    <span />
  </div>
</div>

<style>
  * {
    font-family: Arial, sans-serif;
  }

  #game-wrapper {
    /*border: 4px solid #000000;*/
    width: 800px;
    height: 600px;
    position: absolute;
    top: 0px;
    left: 0px;
    transform: scale(1, 1);
    z-index: 1;
    cursor: none;
  }

  #game {
    position: absolute;
    width: inherit;
    height: inherit;
    /*border: 1px solid #ff0000;*/
    margin-top: 0px;
    margin-left: 0px;
    z-index: 2;
  }

  #control-panel {
    border: 2px solid #b3cffc;
    background-color: #ffffff;
    position: absolute;
    left: 0px;
    top: 0px;
    display: none;
    z-index: 100;
  }

  #control-panel-bar {
    background-color: #b3cffc;
    cursor: initial;
  }

  #control-panel-bar:before {
    content: "Settings";
  }

  #control-panel-x {
    display: inline-block;
    text-align: center;
    float: right;
    color: #ffffff;
    background-color: #cc0000;
    width: 16px;
    height: 16px;
    line-height: 16px;
    cursor: pointer;
  }

  #control-panel-x:before {
    content: "\d7";
  }

  #control-panel-x:hover {
    background-color: #ff4d4d;
  }

  #menu-container {
    position: fixed;
    bottom: 0;
    right: 0;
    cursor: pointer;
    z-index: 99;
  }

  #menu-container:hover #menu-icon {
    visibility: visible;
  }

  #menu-icon {
    width: 30px;
    height: 30px;
    background-color: #cc0000;
    visibility: hidden;
  }

  #menu-icon span {
    position: absolute;
    display: block;
    background-color: #ffffff;
    width: 24px;
    height: 4px;
    margin-left: 3px;
  }

  #menu-icon span:nth-child(1) {
    margin-top: 7px;
  }

  #menu-icon span:nth-child(2) {
    margin-top: 13px;
  }

  #menu-icon span:nth-child(3) {
    margin-top: 19px;
  }
</style>

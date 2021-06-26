const StateManager = {};

StateManager.initialize = function () {
  this.currentState = undefined;
  this.transitioning = false;
};

StateManager.setState = async function (state) {
  this.transitioning = true;
  await state.initialize();
  this.currentState = state;
  this.transitioning = false;
};

StateManager.doUpdate = function (msPerTick, camera) {
  if (!this.transitioning) {
    this.currentState.doUpdate(msPerTick, camera);
  }
};

StateManager.doRender = function (canvas, camera, lag, msPerTick, tdelta) {
  if (!this.transitioning) {
    this.currentState.doRender(canvas, camera, lag, msPerTick, tdelta);
  }
};

export default StateManager;

class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // draw lower layer map
      this.map.drawLowerImage(this.ctx);

      // draw gameobjects

      Object.values(this.map.gameObjects).forEach((object) => {
        //console.log(object);
        object.update({
          arrow: this.directionInput.direction,
        });
        object.sprite.draw(this.ctx);
      });

      // draw upper layer map
      this.map.drawUpperImage(this.ctx);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.directionInput = new DirectionInput();
    this.directionInput.init();
    this.directionInput.direction;
    this.startGameLoop();
  }
}

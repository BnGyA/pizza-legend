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
      // Establish camera
      const cameraPerson = this.map.gameObjects.hero;

      // Update all objects
      Object.values(this.map.gameObjects).forEach((object) => {
        //console.log(object);
        object.update({
          arrow: this.directionInput.direction,
          map: this.map
        });
      });

      // draw lower layer map
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // draw gameobjects
      // Sort gameobjects by their y value to draw them on screen correctly Zindex
      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y;
      }).forEach((object) => {
        object.sprite.draw(this.ctx, cameraPerson);
      });

      // draw upper layer map
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.map.mountObjects();
    this.directionInput = new DirectionInput();
    this.directionInput.init();
    this.directionInput.direction;
    this.startGameLoop();

    this.map.startCutscene([
      {who: "hero", type: "walk", direction: "down" }, 
      {who: "hero", type: "walk", direction: "down" }, 
      {who: "npcB", type: "walk", direction: "left" }, 
      {who: "npcB", type: "walk", direction: "left" }, 
      {who: "npcB", type: "stand", direction: "up", time: 800 }, 
    ]);
  }
}

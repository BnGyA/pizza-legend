class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  init() {
    console.log("Init overworld", this);
    const image = new Image();
    image.src = "/images/maps/DemoLower.png";
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    };

    // Place some GameObjects

    const hero = new GameObject({
      useShadow: true,
      x: 5,
      y: 6,
    });

    const npc1 = new GameObject({
      useShadow: true,
      x: 9,
      y: 6,
      src: "/images/characters/people/npc1.png",
    });

    setTimeout(() => {
      hero.sprite.draw(this.ctx);
      npc1.sprite.draw(this.ctx);
    }, 200);
  }
}

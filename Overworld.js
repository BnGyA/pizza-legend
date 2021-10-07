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

    const x = 5;
    const y = 6;

    const shadow = new Image();
    shadow.src = "/images/characters/shadow.png";
    shadow.onload = () => {
      this.ctx.drawImage(
        shadow,
        0, // left cut
        0, // top cut
        32, // width of cut
        32, // height of cut
        x * 16 - 8,
        y * 16 - 18,
        32,
        32
      );
    };
    const hero = new Image();
    hero.src = "/images/characters/people/hero.png";
    hero.onload = () => {
      this.ctx.drawImage(
        hero,
        0, // left cut
        0, // top cut
        32, // width of cut
        32, // height of cut
        x * 16 - 8,
        y * 16 - 18,
        32,
        32
      );
    };
  }
}

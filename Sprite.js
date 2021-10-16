class Sprite {
  constructor(config) {
    // Setup the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // Shadow
    this.shadow = new Image();
    this.useShadow = true; // config.useShadow || false;
    if (this.useShadow) {
      this.shadow.src = "/images/characters/shadow.png";
      this.shadow.onload = () => {
        this.isShadowLoaded = true;
      };
    }

    // Configure animation & init state
    this.animations = config.animations || {
      idleDown: [[0, 0]],
    };

    this.currentAnimation = config.currentAnimation || "idleDown";
    this.currentAnimationFrame = 0;

    // Reference to gameobject
    this.gameObject = config.gameObject;
  }

  draw(ctx) {
    const x = this.gameObject.x - 8;
    const y = this.gameObject.y - 18;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    this.isLoaded &&
      ctx.drawImage(
        this.image,
        0, // left cut
        0, // top cut
        32, // width of cut
        32, // height of cut, x, y);
        x,
        y,
        32, // size x
        32 // size y
      );
  }
}

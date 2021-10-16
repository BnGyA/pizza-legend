class DirectionInput {
  constructor() {
    this.heldDirections = [];
    this.map = {
      ArrowUp: "up",
      z: "up",
      ArrowDown: "down",
      s: "down",
      ArrowLeft: "left",
      q: "left",
      ArrowRight: "right",
      d: "right",
    };
  }

  get direction() {
    return this.heldDirections[0];
  }
  init() {
    document.addEventListener("keydown", (e) => {
      //console.log(e.key);
      const dir = this.map[e.key];
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    });
    document.addEventListener("keyup", (e) => {
      const dir = this.map[e.key];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    });
  }
}

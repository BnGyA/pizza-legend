class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isPlayerControlled = config.isPlayerControlled || false;
    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // More cases for starting to walk will come here
      // Case: We're keyboard ready and have an arrow pressed and there's no cutscene
      if (
        !state.map.isCutscenePlaying && 
        this.isPlayerControlled &&
        state.arrow
      ) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow
        });
      }
      this.updateSprite(state);
    }
  }

  startBehavior(state, behavior){
    // Set char direction to whatever behavior has
    this.direction = behavior.direction;

      if (behavior.type === "walk"){
        // Stop here if space isn't free
        if (state.map.isSpaceTaken(this.x, this.y, this.direction)){

          // If char has retry method
          behavior.retry && setTimeout(() => {
            this.startBehavior(state, behavior);
          }, 10);

          return;
        }
        
        // Ready to walk!
        state.map.moveWall(this.x, this.y, this.direction);
        this.movingProgressRemaining = 16;
        this.updateSprite(state);
      }

      if(behavior.type === "stand"){
        setTimeout(() => {
          utils.emitEvent("PersonStandComplete", {
            whoId: this.id
          })
        }, behavior.time);
      }
  }

  updatePosition() {
      const [property, change] = this.directionUpdate[this.direction];
      //console.log(this[property], property);
      //console.log(this.y);
      this[property] += change;
      this.movingProgressRemaining -= 1;

      // Create a custom walking complete event 
      if(this.movingProgressRemaining === 0){
        // Emit event finish walking
       utils.emitEvent("PersonWalkingComplete", {
         whoId: this.id
       })
      }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }
}

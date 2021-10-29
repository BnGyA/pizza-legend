class GameObject {
  constructor(config) {
    this.id = null; 
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/images/characters/people/hero.png",
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
  }

  mount(map){
    this.isMounted = true;
    map.addWall(this.x, this.y);
    // If we have a behavior loop, kick off after a short delay 
    setTimeout(() => {
      this.doBehaviorEvent(map)
    }, 10);
  }

  async doBehaviorEvent(map){
    // Don't to anything if there's a more important cutscene or no behavior
     if(map.isCutscenePlaying || this.behaviorLoop.length === 0){
       return;
     }

    // Event infos 
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id; 

    // Event Instance out of our event config
    const eventHandler = new OverworldEvent({
      map, 
      event: eventConfig
    })
    await eventHandler.init();

    // Do this after eventHandler
    // Next behavior
    this.behaviorLoopIndex += 1;
    if(this.behaviorLoopIndex === this.behaviorLoop.length){
      // Reset eventloop 
      this.behaviorLoopIndex = 0; 
    }

    // Do it again
    this.doBehaviorEvent(map);
  }
  update() {}
}

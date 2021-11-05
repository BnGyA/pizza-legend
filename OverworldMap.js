class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {}
    this.walls = config.walls || {};
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutescenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction){
    const {x, y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x}, ${y}`] || false;
  }

  mountObjects(){
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key; 
      // TODO: determine if this object should mount

      object.mount(this);
    })
  }

  async startCutscene(events){
    this.isCutscenePlaying = true;

    // Start a loop of async events
    for(let i=0; i<events.length; i++){
       const eventHandler = new OverworldEvent({
         event: events[i],
         map: this,
       })
       await eventHandler.init();
    }
    // await each one
    this.isCutscenePlaying = false;

    // Reset NPCs behavior
     Object.values(this.gameObjects).forEach(object =>  object.doBehaviorEvent(this))
  }

  checkForActionCutscene(){
    const hero = this.gameObjects["hero"];
    const nextCoord = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x}, ${object.y}` === `${nextCoord.x}, ${nextCoord.y}`
    });
    if(!this.isCutscenePlaying && match && match.talking.length){
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene(){
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x}, ${hero.y}`]
    if(!this.isCutescenePlaying && match){
      this.startCutscene(match[0].events)
    }
  }

  addWall(x, y){
    this.walls[`${x}, ${y}`] = true;
  }

  removeWall(x,y){
    delete this.walls[`${x}, ${y}`];
  }

  moveWall(wasX, wasY, direction){
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

   
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/images/maps/DemoLower.png",
    upperSrc: "/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
      npcA: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: "/images/characters/people/npc2.png",
        behaviorLoop: [
          // {type: "walk", direction: "left"},
          // {type: "stand", direction: "up", time: 800},
          // {type: "walk", direction: "up"},
          // {type: "walk", direction: "right"},
          // {type: "walk", direction: "down"},
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "/images/characters/people/npc1.png",
        behaviorLoop: [
          {type: "stand", direction: "left", time: 800},
          {type: "stand", direction: "up", time: 800},
          {type: "stand", direction: "right", time: 1200},
          {type: "stand", direction: "up", time: 300},
        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "I'm busy...", faceHero: "npcB"},
              {type: "textMessage", text: "Go away!"},
              {who: "hero", type: "walk", direction: "up"}
            ]
          }
        ]
      }),
    },
    walls: {
      //"16,16": true
      [utils.asGridCoord(7,6)]: true,
      [utils.asGridCoord(8,6)]: true,
      [utils.asGridCoord(7,7)]: true,
      [utils.asGridCoord(8,7)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7,4)]: [{
        events: [
          {who: "npcA", type: "walk", direction: "left"},
          {who: "npcA", type: "stand", direction: "up", time: 200},
          {type: "textMessage", text: "You can't be in there!"},
          {who: "npcA", type: "walk", direction: "right"},
          {who: "npcA", type: "stand", direction: "down"},
          {who: "hero", type: "walk", direction: "down"},
          {who: "hero", type: "walk", direction: "left"}
        ]
      }],
      [utils.asGridCoord(5,10)]: [{
        events: [
          {type: "changeMap", map: "Kitchen"}
        ]
      }]

      
    }
  },

  Kitchen: {
    lowerSrc: "/images/maps/KitchenLower.png",
    upperSrc: "/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5),
      }),
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: "/images/characters/people/npc3.png",
        talking: [
          {
            events: [
              {type: "textMessage", text: "You made it", faceHero: "npcB"}
            ]
          }
        ]
      }),
    },
  },
  Street: {
    lowerSrc: "/images/maps/StreetLower.png",
    upperSrc: "/images/maps/StreetUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(10),
      }),
      npcA: new GameObject({
        x: utils.withGrid(10),
        y: utils.withGrid(10),
        src: "/images/characters/people/npc3.png",
      }),
      npcB: new GameObject({
        x: utils.withGrid(30),
        y: utils.withGrid(10),
        src: "/images/characters/people/npc2.png",
      }),
    },
  },
};

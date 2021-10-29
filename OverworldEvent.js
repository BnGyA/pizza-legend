class OverworldEvent{
    constructor({map, event}){
        this.map = map;
        this.event = event;
    }

    stand(resolve){
        const who = this.map.gameObjects[this.event.who ]
        who.startBehavior({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        })
        // Setup a handler when the correct person is done walking then resolve the event
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who){
                document.removeEventListener("PersonStandComplete", completeHandler);
                 resolve();
            }
        }
        document.addEventListener('PersonStandComplete', completeHandler)
    }

    walk(resolve){
        const who = this.map.gameObjects[this.event.who ]
        who.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })
        // Setup a handler when the correct person is done walking then resolve the event
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who){
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                 resolve();
            }
        }
        document.addEventListener('PersonWalkingComplete', completeHandler)
    }

    init(){
        return new Promise(resolve => {
            // ie this.walk(resolve)
            this[this.event.type](resolve)
        })
    }
}
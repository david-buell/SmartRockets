/// <reference path="Scene.ts" />
/// <reference path="Rocket.ts" />

/**
 * Handles the coordination and launching of all rockets. Provides the rockets with new instructions.
 * @author David Buell
 */
class MissionControl extends Scene {

    private rockets: Array<Rocket> = [];

    constructor() {
        super();

        let ctx = this.context;

        //this.context.lineCap = 'round';
        //this.context.lineJoin = 'round';
        //this.context.strokeStyle = 'black';
        //this.context.lineWidth = 1;


        let rocket = new Rocket();
        this.rockets.push(rocket);
    }

    protected draw() : void {
        let ctx = this.context;

        for (let i of this.rockets) {
            i.draw();
        }

    }
}

new MissionControl();
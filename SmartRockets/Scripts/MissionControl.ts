/// <reference path="Scene.ts" />
/// <reference path="Planet.ts" />
/// <reference path="Rocket.ts" />

/**
 * Handles the coordination and launching of all rockets. Provides the rockets with new instructions.
 * @author David Buell
 */
class MissionControl extends Scene {

    private planet: Planet = new Planet();
    private rockets: Array<Rocket> = [];
    private upPressed: boolean = false;
    private leftPressed: boolean = false;
    private rightPressed: boolean = false;

    constructor() {
        super();
        
        this.registerUserInput();

        let rocket = new Rocket();
        rocket.setGravity(-0.02);
        this.rockets.push(rocket);
    }

    protected draw() : void {
        this.planet.draw();
        for (let i of this.rockets) {
            if (this.upPressed) {
                i.fireEngine(Engine.Main);
            }
            if (this.leftPressed) {
                i.fireEngine(Engine.LeftThruster);
            }
            if (this.rightPressed) {
                i.fireEngine(Engine.RightThruster);
            }

            i.draw();
        }
    }

    private registerUserInput(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.defaultPrevented) {
                return;
            }

            if (e.code == 'ArrowLeft') {
                this.leftPressed = true;
                e.preventDefault();
            }
            else if (e.code == 'ArrowRight') {
                this.rightPressed = true;
                e.preventDefault();
            }
            else if (e.code == 'ArrowUp') {
                this.upPressed = true;
                e.preventDefault();
            }

        });
        document.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.defaultPrevented) {
                return;
            }

            if (e.code == 'ArrowLeft') {
                this.leftPressed = false;
                e.preventDefault();
            }
            else if (e.code == 'ArrowRight') {
                this.rightPressed = false;
                e.preventDefault();
            }
            else if (e.code == 'ArrowUp') {
                this.upPressed = false;
                e.preventDefault();
            }
        });
    }
}

new MissionControl();
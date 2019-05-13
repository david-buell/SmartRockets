/// <reference path="Scene.ts" />
/// <reference path="Planet.ts" />
/// <reference path="Rocket.ts" />
/// <reference path="Stats.ts" />

/**
 * Handles the coordination and launching of all rockets. Provides the rockets with new instructions.
 * @author David Buell
 */
class MissionControl extends Scene {

    private planet: Planet = new Planet();
    private rockets: Array<Rocket> = [];
    private stats: Stats = new Stats();

    private upPressed: boolean = false;
    private leftPressed: boolean = false;
    private rightPressed: boolean = false;

    private statsUpdateFrequence = 0;

    constructor() {
        super();
        
        this.registerUserInput();

        let rocket = new Rocket();
        rocket.setGravity(-0.02);
        this.rockets.push(rocket);
    }

    protected draw(): void {
        if (this.paused) return;
        this.planet.draw();
        for (let rocket of this.rockets) {
            if (this.upPressed) {
                rocket.fireEngine(Engine.Main);
            }
            if (this.leftPressed) {
                rocket.fireEngine(Engine.LeftThruster);
            }
            if (this.rightPressed) {
                rocket.fireEngine(Engine.RightThruster);
            }

            rocket.draw();
            if (this.planet.hitTarget(rocket.getHitBox())) {
                rocket.setSuccess();
            }
            if (this.planet.collision(rocket.getHitBox())) {
                rocket.setCrashed();
            }
            if (this.planet.hitGround(rocket.getHitBox())) {
                rocket.setOnGround();
            }
        }
        this.drawStats();
    }

    private drawStats(): void {
        let ctx = this.context;
        let canvas = this.canvas;

        this.updateStats();

        // Status background.
        ctx.beginPath();
        ctx.moveTo(canvas.width - 110, 0);
        ctx.lineTo(canvas.width - 0, 0);
        ctx.lineTo(canvas.width - 0, 130);
        ctx.lineTo(canvas.width - 110, 130);
        ctx.lineTo(canvas.width - 110, 0);
        ctx.fillStyle = 'rgba(41, 153, 43, 0.9)';
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // Status Text
        ctx.font = "12px Helvetica";
        ctx.fillStyle = '#fff';
        ctx.fillText("Mission Control", canvas.width - 100, 20);
        ctx.fillText("Velocity: " + this.stats.Speed, canvas.width - 100, 40);
        ctx.fillText("Heading: " + this.stats.Heading, canvas.width - 100, 60);
        ctx.fillText("Distance: " + this.stats.Distance, canvas.width - 100, 80);
        ctx.fillText("Fuel: " + this.stats.Fuel, canvas.width - 100, 100);
        ctx.fillText("State: " + this.stats.State, canvas.width - 100, 120);
    }

    private updateStats(): void {
        if (this.statsUpdateFrequence == 0) {
            let rocket = this.rockets[0];

            this.stats.Speed = Math.round(rocket.getSpeed() * 100) / 100;
            this.stats.Heading = Math.round(rocket.getHeading() * 10) / 10;
            this.stats.Fuel = Math.round(rocket.getFuel() * 10) / 10;
            this.stats.Distance = Math.round(this.planet.distanceToTarget(rocket.getHitBox()));

            if (rocket.isCrashed()) {
                this.stats.State = "Crashed!";
            }
            else if (rocket.isSuccess()) {
                this.stats.State = "Success";
            }
            else if (rocket.isGrounded()) {
                this.stats.State = "On Ground";
            }
            else {
                this.stats.State = "Flying";
            }
        }
        this.statsUpdateFrequence = (this.statsUpdateFrequence + 1) % 10;
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
        document.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.defaultPrevented) {
                return;
            }
            if (e.key == "p") {
                this.paused = !this.paused;
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
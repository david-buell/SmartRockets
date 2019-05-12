/// <reference path="PageContent.ts" />
/// <reference path="Vector.ts" />

class Rocket extends PageContent {
    private fuel: number = 30;

    private length: number = 43;
    private mainBoosterPower: number = 0.1;
    private sideBoosterPower: number = 0.001;
    private angularDrag: number = 0.00005;

    private position: Vector = new Vector(0, 0);
    private velocity: Vector = new Vector(0, 0);
    private acceleration: Vector = new Vector(0, 0);

    private angularVelocity: number = 0;
    private angularAcceleration: number = 0;

    private gravity: Vector = new Vector(0, 0);
    private heading: number = -90 * Math.PI / 180;

    private pic : HTMLImageElement = new Image();
    private picLoaded : boolean = false;


    constructor() {
        super();

        this.position.set(this.canvas.width / 2, this.canvas.height);

        this.pic.src = '../images/rocket_sm3.png';
        this.pic.onload = () => {
            this.picLoaded = true;
        }
    }

    public fireEngine(d: Engine): void {
        let power = 0;
        if (d == Engine.Main) {
            power = this.mainBoosterPower;
            if (this.fuel < this.mainBoosterPower) {
                power = this.fuel;
                this.fuel = 0;
            }
            else {
                this.fuel -= power;
            }

            let thrust = new Vector(Math.cos(this.heading) * power, Math.sin(this.heading) * power);
            this.acceleration.add(thrust);
        }
        else {
            let power = this.sideBoosterPower;
            if (this.fuel < this.sideBoosterPower) {
                power = this.fuel;
                this.fuel = 0;
            }
            else {
                this.fuel -= power;
            }

            if (d == Engine.LeftThruster) {
                this.angularAcceleration = -power;
            }
            else if (d == Engine.RightThruster) {
                this.angularAcceleration = power;
            }
        }
    }

    public setGravity(magnitude: number): void {
        this.gravity.set(0, -magnitude);
    }

    public ready() : boolean {
        return this.picLoaded;
    }
    
    public draw() : void {
        if (!this.ready()) {
            return;
        }

        let ctx = this.context;
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.heading + (90 * Math.PI / 180));
        ctx.translate(0, -this.length);
        ctx.drawImage(this.pic, 0, 0);

        this.applyPhysics();
        ctx.restore();
    }

    private applyPhysics(): void {
        this.velocity.add(this.acceleration);
        this.velocity.add(this.gravity);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);

        // Apply side booster velocity.
        this.angularVelocity += this.angularAcceleration;
        this.heading += this.angularVelocity;

        // Apply drag to the rotation of the rocket.
        if (this.angularVelocity > 0) {
            if (this.angularVelocity < this.angularDrag) {
                this.angularVelocity = 0;
            }
            else {
                this.angularVelocity -= this.angularDrag;
            }
        }
        else {
            if (this.angularVelocity > this.angularDrag) {
                this.angularVelocity = 0;
            }
            else {
                this.angularVelocity += this.angularDrag;
            }
        }
        this.angularAcceleration = 0;
    }
}
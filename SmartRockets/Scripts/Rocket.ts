/// <reference path="PageContent.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Polygon.ts" />

class Rocket extends PageContent {
    private fuel: number = 100;
    private exploded: boolean = false;
    private succeeded: boolean = false;

    private length: number = 43;
    private width: number = 12;
    private mainBoosterPower: number = 0.1;
    private sideBoosterPower: number = 0.001;
    private angularDrag: number = 0.00005;

    private position: Vector = new Vector(0, 0);
    private velocity: Vector = new Vector(0, 0);
    private acceleration: Vector = new Vector(0, 0);

    private angularVelocity: number = 0;
    private angularAcceleration: number = 0;

    private gravity: Vector = new Vector(0, 0);
    private angle: number = 0;

    private readonly RIGHT_ANGLE_RADIANS: number = 1.5708; //(90 * Math.PI / 180) 

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

            let thrust = new Vector(Math.cos(this.angle - this.RIGHT_ANGLE_RADIANS) * power, Math.sin(this.angle - this.RIGHT_ANGLE_RADIANS) * power);
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

    public destroyed(): void {
        this.exploded = true;
    }

    public success(): void {
        this.succeeded = true;
    }

    public isDestroyed(): boolean {
        return this.exploded;
    }

    public setGravity(magnitude: number): void {
        this.gravity.set(0, -magnitude);
    }

    public ready() : boolean {
        return this.picLoaded;
    }

    public getHitBox(): Polygon {
        let cos = Math.cos(this.angle);
        let sin = Math.sin(this.angle);

        let hitBoxBottomLeft = new Vector(this.position.x, this.position.y);
        let hitBoxTopLeft = new Vector(this.position.x + sin * this.length, this.position.y - cos * this.length);
        let hitBoxBottomRight = new Vector(this.position.x + cos * this.width, this.position.y + sin * this.width);
        let hitBoxTopRight = new Vector(hitBoxTopLeft.x + hitBoxBottomRight.x - hitBoxBottomLeft.x, hitBoxTopLeft.y - hitBoxBottomLeft.y + hitBoxBottomRight.y);

        let polygon = new Polygon();
        polygon.addPoint(hitBoxBottomLeft);
        polygon.addPoint(hitBoxTopLeft);
        polygon.addPoint(hitBoxTopRight);
        polygon.addPoint(hitBoxBottomRight);
        return polygon;
    }
    
    public draw() : void {
        if (!this.ready()) return;

        this.applyPhysics();

        let ctx = this.context;
        ctx.save();
        
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.translate(0, -this.length);
        ctx.drawImage(this.pic, 0, 0);

        ctx.restore();
    }

    private applyPhysics(): void {
        if (this.succeeded) return;

        // No engines, therefore no acceleration except for gravity.
        if (!this.exploded) {
            this.velocity.add(this.acceleration);
            this.angularVelocity += this.angularAcceleration;
        }

        this.velocity.add(this.gravity);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);

        this.angle += this.angularVelocity;

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
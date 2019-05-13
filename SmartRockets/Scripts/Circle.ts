/// <reference path="Vector.ts" />

class Circle {
    private location: Vector = new Vector(0, 0);
    private radius: number = 0;

    constructor(x: number = 0, y: number = 0, radius: number = 0) {
        this.location.x = x;
        this.location.y = y;
        this.radius = radius;
    }

    public getLocation(): Vector { return this.location; };
    public getRadius(): number { return this.radius; };
}
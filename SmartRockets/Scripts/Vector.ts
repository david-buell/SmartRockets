
class Vector {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number, y: number) {
        this.set(x, y);
    }

    public set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public add(v: Vector): void {
        this.x += v.x;
        this.y += v.y;
    }

    public multiply(val: number): void {
        this.x *= val;
        this.y *= val;
    }

    public distance(v: Vector): number {
        return Math.abs(Math.sqrt(((v.x - this.x) * (v.x - this.x)) + ((v.y - this.y) * (v.y - this.y))));
    }

    /** Returns the current heading in radians. */
    public heading(): number {
        return Math.atan2(this.y, this.x);
    }

    public magnitude(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    public isZero(): boolean {
        return (this.x == 0 && this.y == 0);
    }
}
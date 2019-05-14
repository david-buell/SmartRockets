
class Vector {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number = 0, y: number = 0) {
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

    public distance(v?: Vector): number {
        if (v) {
            return Math.abs(Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2)));
        }
        else {
            return Math.abs(Math.sqrt((this.x * this.x) + (this.y * this.y)));
        }
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
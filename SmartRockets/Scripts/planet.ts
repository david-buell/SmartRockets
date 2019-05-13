/// <reference path="PageContent.ts" />

class Planet extends PageContent {

    private obstacles: Polygon[] = [];

    public constructor() {
        super();

        // Center rectangle
        let poly = new Polygon();
        poly.addPoint(new Vector(200, 300));
        poly.addPoint(new Vector(600, 300));
        poly.addPoint(new Vector(600, 320));
        poly.addPoint(new Vector(200, 320));
        this.obstacles.push(poly);

        let leftWall = new Polygon();
        leftWall.addPoint(new Vector(0, 0));
        leftWall.addPoint(new Vector(0, this.canvas.height));
        this.obstacles.push(leftWall);

        let topWall = new Polygon();
        topWall.addPoint(new Vector(0, 0));
        topWall.addPoint(new Vector(this.canvas.width, 0));
        this.obstacles.push(topWall);

        let rightWall = new Polygon();
        rightWall.addPoint(new Vector(this.canvas.width, 0));
        rightWall.addPoint(new Vector(this.canvas.width, this.canvas.height));
        this.obstacles.push(rightWall);

    }

    public collision(p: Polygon): boolean {
        for (let o of this.obstacles) {
            if (o.collisionDetection(p)) {
                return true;
            }
        }
        return false;
    }


    public draw(): void {
        let ctx = this.context;
        ctx.save();

        this.drawTarget(this.canvas.width / 2, 50, 20);


        ctx.restore();
    }

    private drawTarget(x: number, y: number, size: number): void {
        let ctx = this.context;

        for (let o of this.obstacles) {
            ctx.beginPath();
            o.drawPath(ctx);
            ctx.fillStyle = '#ffff33';
            ctx.fill();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#3333ff';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(x, y, size - (size / 3), 0, 2 * Math.PI, false);
        ctx.fillStyle = '#ff3333';
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(x, y, size - (2 * (size / 3)), 0, 2 * Math.PI, false);
        ctx.fillStyle = '#ffff33';
        ctx.fill();
        ctx.closePath();
    }

}
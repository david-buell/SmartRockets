/// <reference path="PageContent.ts" />
/// <reference path="Circle.ts" />

class Planet extends PageContent {

    private obstacles: Polygon[] = [];
    private ground: Polygon;
    private target: Circle;
    private gravity = -0.02;

    public constructor() {
        super();

        this.target = new Circle(this.canvas.width / 2, 50, 20);

        // Center rectangle
        let poly = new Polygon();
        poly.addPoint(new Vector(325, 300));
        poly.addPoint(new Vector(475, 300));
        poly.addPoint(new Vector(475, 350));
        poly.addPoint(new Vector(325, 350));
        this.obstacles.push(poly);

        let poly2 = new Polygon();
        poly2.addPoint(new Vector(200, 300));
        poly2.addPoint(new Vector(600, 300));
        poly2.addPoint(new Vector(600, 320));
        poly2.addPoint(new Vector(200, 320));
        //this.obstacles.push(poly2);

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

        this.ground = new Polygon();
        this.ground.addPoint(new Vector(0, this.canvas.height));
        this.ground.addPoint(new Vector(this.canvas.width, this.canvas.height));
    }

    public collision(p: Polygon): boolean {
        for (let o of this.obstacles) {
            if (o.collisionDetection(p)) {
                return true;
            }
        }
        return false;
    }

    public hitTarget(p: Polygon): boolean {
        return p.collisionDetectionCircle(this.target);
    }

    public hitGround(p: Polygon): boolean {
        return this.ground.collisionDetection(p);
    }

    public distanceToTarget(p: Polygon): number {
        return p.distance(this.target);
    }

    public getGravity(): number {
        return this.gravity;
    }

    public draw(): void {
        let ctx = this.context;
        ctx.save();

        this.drawGround(ctx);
        this.drawTarget();

        ctx.restore();
    }

    private drawGround(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height);
        ctx.lineTo(0, this.canvas.height - 20);
        ctx.lineTo(this.canvas.width, this.canvas.height - 20);
        ctx.lineTo(this.canvas.width, this.canvas.height);
        ctx.lineTo(0, this.canvas.height);
        ctx.fillStyle = '#00ff66';
        ctx.fill();
        ctx.closePath();
    }

    private drawTarget(): void {
        let ctx = this.context;

        for (let o of this.obstacles) {
            ctx.beginPath();
            o.drawPath(ctx);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.75)';
            ctx.strokeStyle = '#000';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.arc(this.target.getLocation().x, this.target.getLocation().y, this.target.getRadius(), 0, 2 * Math.PI, false);
        ctx.fillStyle = '#3333ff';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(this.target.getLocation().x, this.target.getLocation().y, this.target.getRadius() - (this.target.getRadius() / 3), 0, 2 * Math.PI, false);
        ctx.fillStyle = '#ff3333';
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(this.target.getLocation().x, this.target.getLocation().y, this.target.getRadius() - (2 * (this.target.getRadius() / 3)), 0, 2 * Math.PI, false);
        ctx.fillStyle = '#ffff33';
        ctx.fill();
        ctx.closePath();
    }

}
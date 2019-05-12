/// <reference path="PageContent.ts" />

class Planet extends PageContent {

    public draw(): void {
        let ctx = this.context;
        ctx.save();

        this.drawTarget(this.canvas.width / 2, 50, 20);


        ctx.restore();
    }

    private drawTarget(x: number, y: number, size: number): void {
        let ctx = this.context;

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
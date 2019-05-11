/// <reference path="PageContent.ts" />

class Rocket extends PageContent {
    private rectX: number = 200;
    private rectY: number = 50;

    constructor() {
        super();
    }

    public draw() : void {
        let ctx = this.context;

        ctx.beginPath();
        ctx.rect(this.rectX, this.rectY, 10, 10);
        ctx.stroke();
        ctx.closePath();

        this.rectX++;
        this.rectY++;
    }
}
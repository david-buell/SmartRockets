
class PageContent {
    protected canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D;

    constructor() {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let context = canvas.getContext("2d");

        this.canvas = canvas;
        this.context = context;
    }
}
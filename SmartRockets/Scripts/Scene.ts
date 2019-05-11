/// <reference path="PageContent.ts" />>

/**
 * Provides a draw method to use for animations.
 * @author David Buell
 */
abstract class Scene extends PageContent {

    constructor() {
        super();
        window.requestAnimationFrame(() => this.animate());
    }

    /** Creates an event loop and handles cleanup to allow for draw() to work on the canvas. */
    private animate(): void {
        this.clearCanvas();
        this.draw();

        window.requestAnimationFrame(() => this.animate());
    }

    /** Removes all information fromt the canvas while preserving transformations. */
    private clearCanvas(): void {
        // Store the current transformation matrix
        this.context.save();

        // Use the identity matrix while clearing the canvas
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Restore the transform
        this.context.restore();
    }

    /**  */
    protected abstract draw(): void;
}
var PageContent = /** @class */ (function () {
    function PageContent() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        this.canvas = canvas;
        this.context = context;
    }
    return PageContent;
}());
/// <reference path="PageContent.ts" />>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Provides a draw method to use for animations.
 * @author David Buell
 */
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super.call(this) || this;
        window.requestAnimationFrame(function () { return _this.animate(); });
        return _this;
    }
    /** Creates an event loop and handles cleanup to allow for draw() to work on the canvas. */
    Scene.prototype.animate = function () {
        var _this = this;
        this.clearCanvas();
        this.draw();
        window.requestAnimationFrame(function () { return _this.animate(); });
    };
    /** Removes all information fromt the canvas while preserving transformations. */
    Scene.prototype.clearCanvas = function () {
        // Store the current transformation matrix
        this.context.save();
        // Use the identity matrix while clearing the canvas
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Restore the transform
        this.context.restore();
    };
    return Scene;
}(PageContent));
/// <reference path="PageContent.ts" />
var Rocket = /** @class */ (function (_super) {
    __extends(Rocket, _super);
    function Rocket() {
        var _this = _super.call(this) || this;
        _this.rectX = 200;
        _this.rectY = 50;
        return _this;
    }
    Rocket.prototype.draw = function () {
        var ctx = this.context;
        ctx.beginPath();
        ctx.rect(this.rectX, this.rectY, 10, 10);
        ctx.stroke();
        ctx.closePath();
        this.rectX++;
        this.rectY++;
    };
    return Rocket;
}(PageContent));
/// <reference path="Scene.ts" />
/// <reference path="Rocket.ts" />
/**
 * Handles the coordination and launching of all rockets. Provides the rockets with new instructions.
 * @author David Buell
 */
var MissionControl = /** @class */ (function (_super) {
    __extends(MissionControl, _super);
    function MissionControl() {
        var _this = _super.call(this) || this;
        _this.rockets = [];
        var ctx = _this.context;
        //this.context.lineCap = 'round';
        //this.context.lineJoin = 'round';
        //this.context.strokeStyle = 'black';
        //this.context.lineWidth = 1;
        var rocket = new Rocket();
        _this.rockets.push(rocket);
        return _this;
    }
    MissionControl.prototype.draw = function () {
        var ctx = this.context;
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var i = _a[_i];
            i.draw();
        }
    };
    return MissionControl;
}(Scene));
new MissionControl();
//# sourceMappingURL=app.js.map
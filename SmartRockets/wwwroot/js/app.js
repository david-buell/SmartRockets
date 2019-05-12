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
var Planet = /** @class */ (function (_super) {
    __extends(Planet, _super);
    function Planet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Planet.prototype.draw = function () {
        var ctx = this.context;
        ctx.save();
        this.drawTarget(this.canvas.width / 2, 50, 20);
        ctx.restore();
    };
    Planet.prototype.drawTarget = function (x, y, size) {
        var ctx = this.context;
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
    };
    return Planet;
}(PageContent));
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = 0;
        this.y = 0;
        this.set(x, y);
    }
    Vector.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Vector.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
    };
    Vector.prototype.multiply = function (val) {
        this.x *= val;
        this.y *= val;
    };
    /** Returns the current heading in radians. */
    Vector.prototype.heading = function () {
        return Math.atan2(this.y, this.x);
    };
    Vector.prototype.magnitude = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };
    Vector.prototype.isZero = function () {
        return (this.x == 0 && this.y == 0);
    };
    return Vector;
}());
/// <reference path="PageContent.ts" />
/// <reference path="Vector.ts" />
var Rocket = /** @class */ (function (_super) {
    __extends(Rocket, _super);
    function Rocket() {
        var _this = _super.call(this) || this;
        _this.fuel = 30;
        _this.length = 43;
        _this.mainBoosterPower = 0.1;
        _this.sideBoosterPower = 0.001;
        _this.angularDrag = 0.00005;
        _this.position = new Vector(0, 0);
        _this.velocity = new Vector(0, 0);
        _this.acceleration = new Vector(0, 0);
        _this.angularVelocity = 0;
        _this.angularAcceleration = 0;
        _this.gravity = new Vector(0, 0);
        _this.heading = -90 * Math.PI / 180;
        _this.pic = new Image();
        _this.picLoaded = false;
        _this.position.set(_this.canvas.width / 2, _this.canvas.height);
        _this.pic.src = '../images/rocket_sm3.png';
        _this.pic.onload = function () {
            _this.picLoaded = true;
        };
        return _this;
    }
    Rocket.prototype.fireEngine = function (d) {
        var power = 0;
        if (d == Engine.Main) {
            power = this.mainBoosterPower;
            if (this.fuel < this.mainBoosterPower) {
                power = this.fuel;
                this.fuel = 0;
            }
            else {
                this.fuel -= power;
            }
            var thrust = new Vector(Math.cos(this.heading) * power, Math.sin(this.heading) * power);
            this.acceleration.add(thrust);
        }
        else {
            var power_1 = this.sideBoosterPower;
            if (this.fuel < this.sideBoosterPower) {
                power_1 = this.fuel;
                this.fuel = 0;
            }
            else {
                this.fuel -= power_1;
            }
            if (d == Engine.LeftThruster) {
                this.angularAcceleration = -power_1;
            }
            else if (d == Engine.RightThruster) {
                this.angularAcceleration = power_1;
            }
        }
    };
    Rocket.prototype.setGravity = function (magnitude) {
        this.gravity.set(0, -magnitude);
    };
    Rocket.prototype.ready = function () {
        return this.picLoaded;
    };
    Rocket.prototype.draw = function () {
        if (!this.ready()) {
            return;
        }
        var ctx = this.context;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.heading + (90 * Math.PI / 180));
        ctx.translate(0, -this.length);
        ctx.drawImage(this.pic, 0, 0);
        this.applyPhysics();
        ctx.restore();
    };
    Rocket.prototype.applyPhysics = function () {
        this.velocity.add(this.acceleration);
        this.velocity.add(this.gravity);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
        // Apply side booster velocity.
        this.angularVelocity += this.angularAcceleration;
        this.heading += this.angularVelocity;
        // Apply drag to the rotation of the rocket.
        if (this.angularVelocity > 0) {
            if (this.angularVelocity < this.angularDrag) {
                this.angularVelocity = 0;
            }
            else {
                this.angularVelocity -= this.angularDrag;
            }
        }
        else {
            if (this.angularVelocity > this.angularDrag) {
                this.angularVelocity = 0;
            }
            else {
                this.angularVelocity += this.angularDrag;
            }
        }
        this.angularAcceleration = 0;
    };
    return Rocket;
}(PageContent));
/// <reference path="Scene.ts" />
/// <reference path="Planet.ts" />
/// <reference path="Rocket.ts" />
/**
 * Handles the coordination and launching of all rockets. Provides the rockets with new instructions.
 * @author David Buell
 */
var MissionControl = /** @class */ (function (_super) {
    __extends(MissionControl, _super);
    function MissionControl() {
        var _this = _super.call(this) || this;
        _this.planet = new Planet();
        _this.rockets = [];
        _this.upPressed = false;
        _this.leftPressed = false;
        _this.rightPressed = false;
        _this.registerUserInput();
        var rocket = new Rocket();
        rocket.setGravity(-0.02);
        _this.rockets.push(rocket);
        return _this;
    }
    MissionControl.prototype.draw = function () {
        this.planet.draw();
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var i = _a[_i];
            if (this.upPressed) {
                i.fireEngine(Engine.Main);
            }
            if (this.leftPressed) {
                i.fireEngine(Engine.LeftThruster);
            }
            if (this.rightPressed) {
                i.fireEngine(Engine.RightThruster);
            }
            i.draw();
        }
    };
    MissionControl.prototype.registerUserInput = function () {
        var _this = this;
        document.addEventListener('keydown', function (e) {
            if (e.defaultPrevented) {
                return;
            }
            if (e.code == 'ArrowLeft') {
                _this.leftPressed = true;
                e.preventDefault();
            }
            else if (e.code == 'ArrowRight') {
                _this.rightPressed = true;
                e.preventDefault();
            }
            else if (e.code == 'ArrowUp') {
                _this.upPressed = true;
                e.preventDefault();
            }
        });
        document.addEventListener('keyup', function (e) {
            if (e.defaultPrevented) {
                return;
            }
            if (e.code == 'ArrowLeft') {
                _this.leftPressed = false;
                e.preventDefault();
            }
            else if (e.code == 'ArrowRight') {
                _this.rightPressed = false;
                e.preventDefault();
            }
            else if (e.code == 'ArrowUp') {
                _this.upPressed = false;
                e.preventDefault();
            }
        });
    };
    return MissionControl;
}(Scene));
new MissionControl();
var Engine;
(function (Engine) {
    Engine[Engine["Main"] = 0] = "Main";
    Engine[Engine["LeftThruster"] = 1] = "LeftThruster";
    Engine[Engine["RightThruster"] = 2] = "RightThruster";
})(Engine || (Engine = {}));
//# sourceMappingURL=app.js.map
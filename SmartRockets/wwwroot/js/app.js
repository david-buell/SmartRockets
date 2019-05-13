var Engine;
(function (Engine) {
    Engine[Engine["Main"] = 0] = "Main";
    Engine[Engine["LeftThruster"] = 1] = "LeftThruster";
    Engine[Engine["RightThruster"] = 2] = "RightThruster";
})(Engine || (Engine = {}));
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
    }
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
    Vector.prototype.distance = function (v) {
        return Math.abs(Math.sqrt(((v.x - this.x) * (v.x - this.x)) + ((v.y - this.y) * (v.y - this.y))));
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
/// <reference path="Vector.ts" />
var Circle = /** @class */ (function () {
    function Circle(x, y, radius) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (radius === void 0) { radius = 0; }
        this.location = new Vector(0, 0);
        this.radius = 0;
        this.location.x = x;
        this.location.y = y;
        this.radius = radius;
    }
    Circle.prototype.getLocation = function () { return this.location; };
    ;
    Circle.prototype.getRadius = function () { return this.radius; };
    ;
    return Circle;
}());
/// <reference path="PageContent.ts" />
/// <reference path="Circle.ts" />
var Planet = /** @class */ (function (_super) {
    __extends(Planet, _super);
    function Planet() {
        var _this = _super.call(this) || this;
        _this.obstacles = [];
        _this.target = new Circle(_this.canvas.width / 2, 50, 20);
        // Center rectangle
        var poly = new Polygon();
        poly.addPoint(new Vector(200, 300));
        poly.addPoint(new Vector(600, 300));
        poly.addPoint(new Vector(600, 320));
        poly.addPoint(new Vector(200, 320));
        _this.obstacles.push(poly);
        var leftWall = new Polygon();
        leftWall.addPoint(new Vector(0, 0));
        leftWall.addPoint(new Vector(0, _this.canvas.height));
        _this.obstacles.push(leftWall);
        var topWall = new Polygon();
        topWall.addPoint(new Vector(0, 0));
        topWall.addPoint(new Vector(_this.canvas.width, 0));
        _this.obstacles.push(topWall);
        var rightWall = new Polygon();
        rightWall.addPoint(new Vector(_this.canvas.width, 0));
        rightWall.addPoint(new Vector(_this.canvas.width, _this.canvas.height));
        _this.obstacles.push(rightWall);
        return _this;
    }
    Planet.prototype.collision = function (p) {
        for (var _i = 0, _a = this.obstacles; _i < _a.length; _i++) {
            var o = _a[_i];
            if (o.collisionDetection(p)) {
                return true;
            }
        }
        return false;
    };
    Planet.prototype.hitTarget = function (p) {
        return p.collisionDetectionCircle(this.target);
    };
    Planet.prototype.draw = function () {
        var ctx = this.context;
        ctx.save();
        this.drawTarget();
        ctx.restore();
    };
    Planet.prototype.drawTarget = function () {
        var ctx = this.context;
        for (var _i = 0, _a = this.obstacles; _i < _a.length; _i++) {
            var o = _a[_i];
            ctx.beginPath();
            o.drawPath(ctx);
            ctx.fillStyle = '#ffff33';
            ctx.fill();
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
    };
    return Planet;
}(PageContent));
/// <reference path="PageContent.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Circle.ts" />
var Polygon = /** @class */ (function () {
    function Polygon() {
        this.points = [];
        this.length = 0;
    }
    Polygon.prototype.addPoint = function (point) {
        this.points.push(point);
        this.length++;
    };
    Polygon.prototype.getPoints = function () { return this.points; };
    Polygon.prototype.drawPath = function (ctx) {
        if (this.points.length > 1) {
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (var i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.lineTo(this.points[0].x, this.points[0].y);
        }
    };
    /**
    * Helper function to determine whether there is an intersection between the two polygons described
    * by the lists of vertices. Uses the Separating Axis Theorem
    *
    * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
    * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
    * @return true if there is any intersection between the 2 polygons, false otherwise
    */
    Polygon.prototype.collisionDetection = function (b) {
        var polygons = [this, b];
        var minA, maxA, projected, i, i1, j, minB, maxB;
        for (i = 0; i < polygons.length; i++) {
            // for each polygon, look at each edge of the polygon, and determine if it separates
            // the two shapes
            var polygon = polygons[i];
            for (i1 = 0; i1 < polygon.length; i1++) {
                // grab 2 vertices to create an edge
                var i2 = (i1 + 1) % polygon.length;
                var p1 = polygon.getPoints()[i1];
                var p2 = polygon.getPoints()[i2];
                // find the line perpendicular to this edge
                var normal = { x: p2.y - p1.y, y: p1.x - p2.x };
                minA = maxA = undefined;
                // for each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                for (j = 0; j < this.length; j++) {
                    projected = normal.x * this.getPoints()[j].x + normal.y * this.getPoints()[j].y;
                    if (minA === undefined || projected < minA) {
                        minA = projected;
                    }
                    if (maxA === undefined || projected > maxA) {
                        maxA = projected;
                    }
                }
                // for each vertex in the second shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                minB = maxB = undefined;
                for (j = 0; j < b.length; j++) {
                    projected = normal.x * b.getPoints()[j].x + normal.y * b.getPoints()[j].y;
                    if (minB === undefined || projected < minB) {
                        minB = projected;
                    }
                    if (maxB === undefined || projected > maxB) {
                        maxB = projected;
                    }
                }
                // if there is no overlap between the projects, the edge we are looking at separates the two
                // polygons, and we know there is no overlap
                if (maxA < minB || maxB < minA) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * Inaccurate simplified Polygon - Circle collision detection.
     * @param circle
     */
    Polygon.prototype.collisionDetectionCircle = function (circle) {
        for (var _i = 0, _a = this.getPoints(); _i < _a.length; _i++) {
            var points = _a[_i];
            if (points.distance(circle.getLocation()) < circle.getRadius()) {
                return true;
            }
        }
        return false;
    };
    return Polygon;
}());
/// <reference path="PageContent.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Polygon.ts" />
var Rocket = /** @class */ (function (_super) {
    __extends(Rocket, _super);
    function Rocket() {
        var _this = _super.call(this) || this;
        _this.fuel = 100;
        _this.exploded = false;
        _this.succeeded = false;
        _this.length = 43;
        _this.width = 12;
        _this.mainBoosterPower = 0.1;
        _this.sideBoosterPower = 0.001;
        _this.angularDrag = 0.00005;
        _this.position = new Vector(0, 0);
        _this.velocity = new Vector(0, 0);
        _this.acceleration = new Vector(0, 0);
        _this.angularVelocity = 0;
        _this.angularAcceleration = 0;
        _this.gravity = new Vector(0, 0);
        _this.angle = 0;
        _this.RIGHT_ANGLE_RADIANS = 1.5708; //(90 * Math.PI / 180) 
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
            var thrust = new Vector(Math.cos(this.angle - this.RIGHT_ANGLE_RADIANS) * power, Math.sin(this.angle - this.RIGHT_ANGLE_RADIANS) * power);
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
    Rocket.prototype.destroyed = function () {
        this.exploded = true;
    };
    Rocket.prototype.success = function () {
        this.succeeded = true;
    };
    Rocket.prototype.isDestroyed = function () {
        return this.exploded;
    };
    Rocket.prototype.setGravity = function (magnitude) {
        this.gravity.set(0, -magnitude);
    };
    Rocket.prototype.ready = function () {
        return this.picLoaded;
    };
    Rocket.prototype.getHitBox = function () {
        var cos = Math.cos(this.angle);
        var sin = Math.sin(this.angle);
        var hitBoxBottomLeft = new Vector(this.position.x, this.position.y);
        var hitBoxTopLeft = new Vector(this.position.x + sin * this.length, this.position.y - cos * this.length);
        var hitBoxBottomRight = new Vector(this.position.x + cos * this.width, this.position.y + sin * this.width);
        var hitBoxTopRight = new Vector(hitBoxTopLeft.x + hitBoxBottomRight.x - hitBoxBottomLeft.x, hitBoxTopLeft.y - hitBoxBottomLeft.y + hitBoxBottomRight.y);
        var polygon = new Polygon();
        polygon.addPoint(hitBoxBottomLeft);
        polygon.addPoint(hitBoxTopLeft);
        polygon.addPoint(hitBoxTopRight);
        polygon.addPoint(hitBoxBottomRight);
        return polygon;
    };
    Rocket.prototype.draw = function () {
        if (!this.ready())
            return;
        this.applyPhysics();
        var ctx = this.context;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.translate(0, -this.length);
        ctx.drawImage(this.pic, 0, 0);
        ctx.restore();
    };
    Rocket.prototype.applyPhysics = function () {
        if (this.succeeded)
            return;
        // No engines, therefore no acceleration except for gravity.
        if (!this.exploded) {
            this.velocity.add(this.acceleration);
            this.angularVelocity += this.angularAcceleration;
        }
        this.velocity.add(this.gravity);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
        this.angle += this.angularVelocity;
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
            var rocket = _a[_i];
            if (this.upPressed) {
                rocket.fireEngine(Engine.Main);
            }
            if (this.leftPressed) {
                rocket.fireEngine(Engine.LeftThruster);
            }
            if (this.rightPressed) {
                rocket.fireEngine(Engine.RightThruster);
            }
            rocket.draw();
            if (this.planet.collision(rocket.getHitBox())) {
                rocket.destroyed();
            }
            if (this.planet.hitTarget(rocket.getHitBox())) {
                rocket.success();
            }
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
//# sourceMappingURL=app.js.map
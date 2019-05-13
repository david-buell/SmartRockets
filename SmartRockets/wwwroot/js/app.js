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
        var _this = _super.call(this) || this;
        _this.obstacles = [];
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
    Planet.prototype.draw = function () {
        var ctx = this.context;
        ctx.save();
        this.drawTarget(this.canvas.width / 2, 50, 20);
        ctx.restore();
    };
    Planet.prototype.drawTarget = function (x, y, size) {
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
     * Determines if a polygon and a circle are colliding
     * @param {Polygon} a The source polygon to test
     * @param {Circle} b The target circle to test against
     * @param {Result} [result = null] A Result object on which to store information about the collision
     * @param {Boolean} [reverse = false] Set to true to reverse a and b in the result parameter when testing circle->polygon instead of polygon->circle
     * @returns {Boolean}
     */
    Polygon.prototype.polygonCircle = function (a, b, result, reverse) {
        if (result === void 0) { result = null; }
        if (reverse === void 0) { reverse = false; }
        var a_coords = a._coords;
        var a_edges = a._edges;
        var a_normals = a._normals;
        var b_x = b.x;
        var b_y = b.y;
        var b_radius = b.radius * b.scale;
        var b_radius2 = b_radius * 2;
        var radius_squared = b_radius * b_radius;
        var count = a_coords.length;
        var a_in_b = true;
        var b_in_a = true;
        var overlap = null;
        var overlap_x = 0;
        var overlap_y = 0;
        // Handle points specially
        if (count === 2) {
            var coord_x = b_x - a_coords[0];
            var coord_y = b_y - a_coords[1];
            var length_squared = coord_x * coord_x + coord_y * coord_y;
            if (length_squared > radius_squared) {
                return false;
            }
            if (result) {
                var length_1 = Math.sqrt(length_squared);
                overlap = b_radius - length_1;
                overlap_x = coord_x / length_1;
                overlap_y = coord_y / length_1;
                b_in_a = false;
            }
        }
        else {
            for (var ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
                var coord_x = b_x - a_coords[ix];
                var coord_y = b_y - a_coords[iy];
                var edge_x = a_edges[ix];
                var edge_y = a_edges[iy];
                var dot = coord_x * edge_x + coord_y * edge_y;
                var region = dot < 0 ? -1 : dot > edge_x * edge_x + edge_y * edge_y ? 1 : 0;
                var tmp_overlapping = false;
                var tmp_overlap = 0;
                var tmp_overlap_x = 0;
                var tmp_overlap_y = 0;
                if (result && a_in_b && coord_x * coord_x + coord_y * coord_y > radius_squared) {
                    a_in_b = false;
                }
                if (region) {
                    var left = region === -1;
                    var other_x = left ? (ix === 0 ? count - 2 : ix - 2) : (ix === count - 2 ? 0 : ix + 2);
                    var other_y = other_x + 1;
                    var coord2_x = b_x - a_coords[other_x];
                    var coord2_y = b_y - a_coords[other_y];
                    var edge2_x = a_edges[other_x];
                    var edge2_y = a_edges[other_y];
                    var dot2 = coord2_x * edge2_x + coord2_y * edge2_y;
                    var region2 = dot2 < 0 ? -1 : dot2 > edge2_x * edge2_x + edge2_y * edge2_y ? 1 : 0;
                    if (region2 === -region) {
                        var target_x = left ? coord_x : coord2_x;
                        var target_y = left ? coord_y : coord2_y;
                        var length_squared = target_x * target_x + target_y * target_y;
                        if (length_squared > radius_squared) {
                            return false;
                        }
                        if (result) {
                            var length_2 = Math.sqrt(length_squared);
                            tmp_overlapping = true;
                            tmp_overlap = b_radius - length_2;
                            tmp_overlap_x = target_x / length_2;
                            tmp_overlap_y = target_y / length_2;
                            b_in_a = false;
                        }
                    }
                }
                else {
                    var normal_x = a_normals[ix];
                    var normal_y = a_normals[iy];
                    var length_3 = coord_x * normal_x + coord_y * normal_y;
                    var absolute_length = length_3 < 0 ? -length_3 : length_3;
                    if (length_3 > 0 && absolute_length > b_radius) {
                        return false;
                    }
                    if (result) {
                        tmp_overlapping = true;
                        tmp_overlap = b_radius - length_3;
                        tmp_overlap_x = normal_x;
                        tmp_overlap_y = normal_y;
                        if (b_in_a && length_3 >= 0 || tmp_overlap < b_radius2) {
                            b_in_a = false;
                        }
                    }
                }
                if (tmp_overlapping && (overlap === null || overlap > tmp_overlap)) {
                    overlap = tmp_overlap;
                    overlap_x = tmp_overlap_x;
                    overlap_y = tmp_overlap_y;
                }
            }
        }
        if (result) {
            result.a_in_b = reverse ? b_in_a : a_in_b;
            result.b_in_a = reverse ? a_in_b : b_in_a;
            result.overlap = overlap;
            result.overlap_x = reverse ? -overlap_x : overlap_x;
            result.overlap_y = reverse ? -overlap_y : overlap_y;
        }
        return true;
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
        if (this.exploded)
            return;
        this.velocity.add(this.acceleration);
        this.velocity.add(this.gravity);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
        // Apply side booster velocity.
        this.angularVelocity += this.angularAcceleration;
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
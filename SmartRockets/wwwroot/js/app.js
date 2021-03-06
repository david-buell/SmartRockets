var Vector = /** @class */ (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
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
        if (v) {
            return Math.abs(Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2)));
        }
        else {
            return Math.abs(Math.sqrt((this.x * this.x) + (this.y * this.y)));
        }
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
var Command;
(function (Command) {
    Command[Command["Wait"] = 0] = "Wait";
    Command[Command["MainEngine"] = 1] = "MainEngine";
    Command[Command["LeftThruster"] = 2] = "LeftThruster";
    Command[Command["RightThruster"] = 3] = "RightThruster";
})(Command || (Command = {}));
/// <reference path="Command.ts" />
var DNA = /** @class */ (function () {
    function DNA(genes) {
        if (genes === void 0) { genes = undefined; }
        this.genes = [];
        if (genes) {
            this.genes = genes;
        }
        else {
            for (var i = 0; i < 1000; i++) {
                this.genes.push(this.randomCommand());
            }
        }
    }
    DNA.prototype.randomCommand = function () {
        var num = Math.floor(Math.random() * 4) + 1;
        if (num == 1) {
            return Command.Wait;
        }
        else if (num == 2) {
            return Command.MainEngine;
        }
        else if (num == 3) {
            return Command.LeftThruster;
        }
        else if (num == 4) {
            return Command.RightThruster;
        }
    };
    /**
     * Make a child out of two DNA objects.
     * @param partner
     */
    DNA.prototype.crossover = function (partner, lastFrame) {
        var childGenes = [];
        var mid = Math.floor(Math.random() * lastFrame); // choose a midpoint within the number of frames that was ran.
        for (var i = 0; i < this.genes.length; i++) {
            if (i > mid) {
                childGenes.push(this.genes[i]);
            }
            else {
                childGenes.push(partner.genes[i]);
            }
        }
        return new DNA(childGenes);
    };
    DNA.prototype.mutation = function (percent) {
        if (percent === void 0) { percent = 0.01; }
        for (var i = 0; i < this.genes.length; i++) {
            if (Math.random() < percent) {
                this.genes[i] = this.randomCommand();
            }
        }
    };
    return DNA;
}());
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
        _this.paused = false;
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
        if (this.paused)
            return; // don't update the screen if paused.
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
/// <reference path="Circle.ts" />
var Planet = /** @class */ (function (_super) {
    __extends(Planet, _super);
    function Planet() {
        var _this = _super.call(this) || this;
        _this.obstacles = [];
        _this.gravity = -0.02;
        _this.target = new Circle(_this.canvas.width / 2, 50, 20);
        // Center rectangle
        var poly = new Polygon();
        poly.addPoint(new Vector(325, 300));
        poly.addPoint(new Vector(475, 300));
        poly.addPoint(new Vector(475, 350));
        poly.addPoint(new Vector(325, 350));
        _this.obstacles.push(poly);
        var poly2 = new Polygon();
        poly2.addPoint(new Vector(200, 300));
        poly2.addPoint(new Vector(600, 300));
        poly2.addPoint(new Vector(600, 320));
        poly2.addPoint(new Vector(200, 320));
        //this.obstacles.push(poly2);
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
        _this.ground = new Polygon();
        _this.ground.addPoint(new Vector(0, _this.canvas.height));
        _this.ground.addPoint(new Vector(_this.canvas.width, _this.canvas.height));
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
    Planet.prototype.hitGround = function (p) {
        return this.ground.collisionDetection(p);
    };
    Planet.prototype.distanceToTarget = function (p) {
        return p.distance(this.target);
    };
    Planet.prototype.getGravity = function () {
        return this.gravity;
    };
    Planet.prototype.draw = function () {
        var ctx = this.context;
        ctx.save();
        this.drawGround(ctx);
        this.drawTarget();
        ctx.restore();
    };
    Planet.prototype.drawGround = function (ctx) {
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height);
        ctx.lineTo(0, this.canvas.height - 20);
        ctx.lineTo(this.canvas.width, this.canvas.height - 20);
        ctx.lineTo(this.canvas.width, this.canvas.height);
        ctx.lineTo(0, this.canvas.height);
        ctx.fillStyle = '#00ff66';
        ctx.fill();
        ctx.closePath();
    };
    Planet.prototype.drawTarget = function () {
        var ctx = this.context;
        for (var _i = 0, _a = this.obstacles; _i < _a.length; _i++) {
            var o = _a[_i];
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
    Polygon.prototype.distance = function (circle) {
        var minDistance = -1;
        for (var _i = 0, _a = this.getPoints(); _i < _a.length; _i++) {
            var points = _a[_i];
            var distance = points.distance(circle.getLocation());
            if (minDistance < 0)
                minDistance = distance;
            if (minDistance < distance)
                minDistance = distance;
        }
        return minDistance;
    };
    return Polygon;
}());
/// <reference path="PageContent.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Polygon.ts" />
var Rocket = /** @class */ (function (_super) {
    __extends(Rocket, _super);
    function Rocket(id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this) || this;
        _this.id = 0;
        _this.fuelCapacity = 100;
        _this.fuel = _this.fuelCapacity;
        _this.crashed = false;
        _this.success = false;
        _this.grounded = true;
        _this.length = 43;
        _this.width = 12;
        _this.mainBoosterPower = 0.1;
        _this.sideBoosterPower = 0.001;
        _this.angularDrag = 0.00005;
        _this.position = new Vector();
        _this.velocity = new Vector();
        _this.acceleration = new Vector();
        _this.angularVelocity = 0;
        _this.angularAcceleration = 0;
        _this.gravity = new Vector();
        _this.angle = 0;
        _this.fitness = 0;
        _this.RIGHT_ANGLE_RADIANS = 1.5708; //(90 * Math.PI / 180) 
        _this.RAD_TO_DEG = 57.2958; //(180 / Math.PI) 
        _this.pic = new Image();
        _this.picLoaded = false;
        _this.id = id;
        _this.position.set(_this.canvas.width / 2, _this.canvas.height - 5);
        _this.pic.src = ROOT + '/images/rocket.png';
        _this.pic.onload = function () {
            _this.picLoaded = true;
        };
        return _this;
    }
    Rocket.prototype.getId = function () {
        return this.id;
    };
    Rocket.prototype.fireEngine = function (d) {
        if (this.crashed)
            return; // Engines can't fire if the rocket is destroyed.
        var power = 0;
        if (d == Engine.Main) {
            this.grounded = false; // Assume the rocket is no longer touching the ground
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
    Rocket.prototype.setCrashed = function () {
        // kill all moment in all directions.
        if (!this.crashed) {
            this.velocity.set(0, 0);
            this.crashed = true;
        }
    };
    Rocket.prototype.setOnGround = function () {
        this.crashed = true;
        this.velocity.set(0, 0);
        this.angularVelocity = 0;
        this.grounded = true;
    };
    Rocket.prototype.isGrounded = function () {
        return this.grounded;
    };
    Rocket.prototype.setSuccess = function () {
        this.success = true;
    };
    Rocket.prototype.isSuccess = function () {
        return this.success;
    };
    Rocket.prototype.isCrashed = function () {
        return this.crashed;
    };
    Rocket.prototype.isComplete = function () {
        return this.crashed || this.success;
    };
    Rocket.prototype.setGravity = function (magnitude) {
        this.gravity.set(0, -magnitude);
    };
    Rocket.prototype.setFitness = function (fitness) {
        this.fitness = fitness;
    };
    Rocket.prototype.getFitness = function () {
        return this.fitness;
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
    Rocket.prototype.getSpeed = function () {
        return this.velocity.distance();
    };
    Rocket.prototype.getHeading = function () {
        var deg = (this.angle * this.RAD_TO_DEG) % 360;
        if (deg < 0) {
            deg = 360 + deg;
        }
        return deg;
    };
    Rocket.prototype.getFuel = function () {
        return this.fuel;
    };
    Rocket.prototype.getFuelCapacity = function () {
        return this.fuelCapacity;
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
        if (this.success)
            return;
        // No engines, therefore no acceleration except for gravity.
        if (!this.crashed) {
            this.velocity.add(this.acceleration);
            this.angularVelocity += this.angularAcceleration;
        }
        if (!this.grounded) {
            this.velocity.add(this.gravity);
        }
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
var Stats = /** @class */ (function () {
    function Stats() {
        this.Speed = 0;
        this.Heading = 0;
        this.Fuel = 0;
        this.Fitness = 0;
        this.State = "";
        this.populationSize = 0;
        this.generation = 1;
        this.generationBestFit = 0;
        this.overallBestFit = 0;
    }
    return Stats;
}());
/// <reference path="Scene.ts" />
/// <reference path="Planet.ts" />
/// <reference path="Rocket.ts" />
/// <reference path="Stats.ts" />
/// <reference path="DNA.ts" />
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
        _this.dnaStrands = [];
        _this.matingpool = [];
        _this.stats = new Stats();
        _this.useAI = true;
        _this.populationSize = 20;
        _this.mutationPercentage = 0.01;
        _this.upPressed = false;
        _this.leftPressed = false;
        _this.rightPressed = false;
        _this.frame = 0;
        _this.statsUpdateFrequence = 0;
        _this.registerUserInput();
        for (var i = 0; i < _this.populationSize; i++) {
            var rocket = new Rocket(i);
            rocket.setGravity(_this.planet.getGravity());
            _this.rockets.push(rocket);
            var dna = new DNA();
            _this.dnaStrands.push(dna);
        }
        return _this;
    }
    MissionControl.prototype.draw = function () {
        if (this.paused)
            return;
        this.planet.draw();
        var complete = true;
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var rocket = _a[_i];
            if (!rocket.isComplete()) {
                complete = false;
            }
            this.calcFitness(rocket);
            this.issueCommands(rocket);
            rocket.draw();
            if (this.planet.hitTarget(rocket.getHitBox())) {
                rocket.setSuccess();
            }
            if (this.planet.collision(rocket.getHitBox())) {
                rocket.setCrashed();
            }
            if (this.planet.hitGround(rocket.getHitBox())) {
                rocket.setOnGround();
            }
        }
        this.drawStats();
        this.frame++;
        if (complete && this.useAI) {
            this.nextSimulation();
            this.frame = 0;
        }
    };
    MissionControl.prototype.issueCommands = function (rocket) {
        if (this.useAI) {
            var dna = this.dnaStrands[rocket.getId()];
            var command = dna.genes[this.frame];
            if (command == Command.MainEngine)
                rocket.fireEngine(Engine.Main);
            if (command == Command.LeftThruster)
                rocket.fireEngine(Engine.LeftThruster);
            if (command == Command.RightThruster)
                rocket.fireEngine(Engine.RightThruster);
        }
        else {
            if (this.upPressed) {
                rocket.fireEngine(Engine.Main);
            }
            if (this.leftPressed) {
                rocket.fireEngine(Engine.LeftThruster);
            }
            if (this.rightPressed) {
                rocket.fireEngine(Engine.RightThruster);
            }
        }
    };
    MissionControl.prototype.calcFitness = function (rocket) {
        var distance = Math.round(this.planet.distanceToTarget(rocket.getHitBox()));
        var fitness = Math.pow(this.canvas.height * 2 - distance, 3) + (rocket.getFuelCapacity() - rocket.getFuel());
        if (rocket.isSuccess()) {
            fitness *= 10;
        }
        else if (rocket.isCrashed()) {
            fitness /= 10;
        }
        if (rocket.getFitness() < fitness) {
            rocket.setFitness(fitness);
        }
        return fitness;
    };
    MissionControl.prototype.nextSimulation = function () {
        this.stats.generation++;
        var maxfit = 0;
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var rocket = _a[_i];
            if (rocket.getFitness() > maxfit) {
                maxfit = rocket.getFitness();
            }
        }
        // normalize fitness between zero and 1.
        for (var _b = 0, _c = this.rockets; _b < _c.length; _b++) {
            var rocket = _c[_b];
            rocket.setFitness(rocket.getFitness() / maxfit);
        }
        this.matingpool = [];
        for (var _d = 0, _e = this.rockets; _d < _e.length; _d++) {
            var rocket = _e[_d];
            var dna = this.dnaStrands[rocket.getId()];
            var n = rocket.getFitness() * 100;
            for (var j = 0; j < n; j++) {
                this.matingpool.push(dna);
            }
        }
        this.selection();
    };
    MissionControl.prototype.selection = function () {
        var newDna = [];
        for (var i = 0; i < this.rockets.length; i++) {
            var randomIndexA = Math.floor(Math.random() * this.matingpool.length);
            var parentA = this.matingpool[randomIndexA];
            var randomIndexB = Math.floor(Math.random() * this.matingpool.length);
            var parentB = this.matingpool[randomIndexB];
            var child = parentA.crossover(parentB, this.frame);
            child.mutation();
            newDna.push(child);
            this.rockets[i] = new Rocket(i);
            this.rockets[i].setGravity(this.planet.getGravity());
        }
        this.dnaStrands = newDna;
    };
    MissionControl.prototype.drawStats = function () {
        var ctx = this.context;
        var canvas = this.canvas;
        this.updateStats();
        if (this.useAI) {
            // Status background.
            ctx.beginPath();
            ctx.moveTo(canvas.width - 130, 0);
            ctx.lineTo(canvas.width - 0, 0);
            ctx.lineTo(canvas.width - 0, 130);
            ctx.lineTo(canvas.width - 130, 130);
            ctx.lineTo(canvas.width - 130, 0);
            ctx.fillStyle = 'rgba(41, 153, 43, 0.9)';
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            // Status Text
            ctx.font = "12px Helvetica";
            ctx.fillStyle = '#fff';
            ctx.fillText("Mission Control", canvas.width - 120, 20);
            ctx.fillText("Generation: " + this.stats.generation, canvas.width - 120, 40);
            ctx.fillText("Population Size: " + this.stats.populationSize, canvas.width - 120, 60);
            ctx.fillText("Mutation%: " + this.mutationPercentage, canvas.width - 120, 80);
            ctx.fillText("Max Fit: " + this.stats.generationBestFit, canvas.width - 120, 100);
            ctx.fillText("Overall Max Fit: " + this.stats.overallBestFit, canvas.width - 120, 120);
        }
        else {
            // Status background.
            ctx.beginPath();
            ctx.moveTo(canvas.width - 110, 0);
            ctx.lineTo(canvas.width - 0, 0);
            ctx.lineTo(canvas.width - 0, 130);
            ctx.lineTo(canvas.width - 110, 130);
            ctx.lineTo(canvas.width - 110, 0);
            ctx.fillStyle = 'rgba(41, 153, 43, 0.9)';
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            // Status Text
            ctx.font = "12px Helvetica";
            ctx.fillStyle = '#fff';
            ctx.fillText("Mission Control", canvas.width - 100, 20);
            ctx.fillText("Velocity: " + this.stats.Speed, canvas.width - 100, 40);
            ctx.fillText("Heading: " + this.stats.Heading, canvas.width - 100, 60);
            ctx.fillText("Fitness: " + this.stats.Fitness, canvas.width - 100, 80);
            ctx.fillText("Fuel: " + this.stats.Fuel, canvas.width - 100, 100);
            ctx.fillText("State: " + this.stats.State, canvas.width - 100, 120);
        }
    };
    MissionControl.prototype.updateStats = function () {
        if (this.statsUpdateFrequence == 0) {
            if (this.useAI) {
                var bestFit = 0;
                for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
                    var rocket = _a[_i];
                    if (rocket.getFitness() > bestFit) {
                        bestFit = rocket.getFitness();
                    }
                }
                if (this.stats.overallBestFit < bestFit) {
                    this.stats.overallBestFit = bestFit;
                }
                this.stats.populationSize = this.rockets.length;
                this.stats.generationBestFit = bestFit;
            }
            else {
                var rocket = this.rockets[0];
                this.stats.Speed = Math.round(rocket.getSpeed() * 100) / 100;
                this.stats.Heading = Math.round(rocket.getHeading() * 10) / 10;
                this.stats.Fuel = Math.round(rocket.getFuel() * 10) / 10;
                this.stats.Fitness = rocket.getFitness();
                if (rocket.isCrashed()) {
                    this.stats.State = "Crashed!";
                }
                else if (rocket.isSuccess()) {
                    this.stats.State = "Success";
                }
                else if (rocket.isGrounded()) {
                    this.stats.State = "On Ground";
                }
                else {
                    this.stats.State = "Flying";
                }
            }
        }
        this.statsUpdateFrequence = (this.statsUpdateFrequence + 1) % 10;
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
        document.addEventListener('keypress', function (e) {
            if (e.defaultPrevented) {
                return;
            }
            if (e.key == "p") {
                _this.paused = !_this.paused;
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
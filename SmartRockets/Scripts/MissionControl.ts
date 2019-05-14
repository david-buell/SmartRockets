/// <reference path="Scene.ts" />
/// <reference path="Planet.ts" />
/// <reference path="Rocket.ts" />
/// <reference path="Stats.ts" />
/// <reference path="DNA.ts" />

/**
 * Handles the coordination and launching of all rockets. Provides the rockets with new instructions.
 * @author David Buell
 */
class MissionControl extends Scene {

    private planet: Planet = new Planet();
    private rockets: Array<Rocket> = [];
    private dnaStrands: Array<DNA> = [];
    private matingpool: Array<DNA> = [];

    private stats: Stats = new Stats();

    private useAI = true;
    private mutationPercentage = 0.01;

    private upPressed: boolean = false;
    private leftPressed: boolean = false;
    private rightPressed: boolean = false;

    private frame = 0;
    private statsUpdateFrequence = 0;

    constructor() {
        super();
        
        this.registerUserInput();

        for (let i = 0; i < 20; i++) {
            let rocket = new Rocket(i);
            rocket.setGravity(this.planet.getGravity());
            this.rockets.push(rocket);

            let dna = new DNA();
            this.dnaStrands.push(dna);
        }
    }

    protected draw(): void {
        if (this.paused) return;
        this.planet.draw();

        let complete = true;
        for (let rocket of this.rockets) {
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
    }

    private issueCommands(rocket: Rocket): void {
        if (this.useAI) {
            let dna = this.dnaStrands[rocket.getId()];
            let command = dna.genes[this.frame];
            if (command == Command.MainEngine) rocket.fireEngine(Engine.Main);
            if (command == Command.LeftThruster) rocket.fireEngine(Engine.LeftThruster);
            if (command == Command.RightThruster) rocket.fireEngine(Engine.RightThruster);
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
    }

    private calcFitness(rocket: Rocket): number {
        let distance = Math.round(this.planet.distanceToTarget(rocket.getHitBox()));
        let fitness = this.canvas.height * 2 - distance;
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
    }

    private nextSimulation(): void {
        this.stats.generation++;

        let maxfit = 0;
        for (let rocket of this.rockets) {
            if (rocket.getFitness() > maxfit) {
                maxfit = rocket.getFitness();
            }
        }

        // normalize fitness between zero and 1.
        for (let rocket of this.rockets) {
            rocket.setFitness(rocket.getFitness() / maxfit);  
        }

        this.matingpool = [];
        for (let rocket of this.rockets) {
            let dna = this.dnaStrands[rocket.getId()];

            let n = rocket.getFitness() * 100;
            for (let j = 0; j < n; j++) {
                this.matingpool.push(dna);
            }
        }
        this.selection();
    }

    private selection(): void {
        var newDna: Array<DNA> = [];

        for (var i = 0; i < this.rockets.length; i++) {
            let randomIndexA = Math.floor(Math.random() * this.matingpool.length);
            let parentA = this.matingpool[randomIndexA];

            let randomIndexB = Math.floor(Math.random() * this.matingpool.length);
            let parentB = this.matingpool[randomIndexB];

            let child = parentA.crossover(parentB, this.frame);
            child.mutation();
            newDna.push(child);
            this.rockets[i] = new Rocket(i);
            this.rockets[i].setGravity(this.planet.getGravity());
        }
        this.dnaStrands = newDna;
    }

    private drawStats(): void {
        let ctx = this.context;
        let canvas = this.canvas;

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
    }

    private updateStats(): void {
        if (this.statsUpdateFrequence == 0) {
            if (this.useAI) {
                let bestFit = 0;
                for (let rocket of this.rockets) {
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
                let rocket = this.rockets[0];

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
    }

    private registerUserInput(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.defaultPrevented) {
                return;
            }

            if (e.code == 'ArrowLeft') {
                this.leftPressed = true;
                e.preventDefault();
            }
            else if (e.code == 'ArrowRight') {
                this.rightPressed = true;
                e.preventDefault();
            }
            else if (e.code == 'ArrowUp') {
                this.upPressed = true;
                e.preventDefault();
            }
        });
        document.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.defaultPrevented) {
                return;
            }
            if (e.key == "p") {
                this.paused = !this.paused;
                e.preventDefault();
            }

        });
        document.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.defaultPrevented) {
                return;
            }

            if (e.code == 'ArrowLeft') {
                this.leftPressed = false;
                e.preventDefault();
            }
            else if (e.code == 'ArrowRight') {
                this.rightPressed = false;
                e.preventDefault();
            }
            else if (e.code == 'ArrowUp') {
                this.upPressed = false;
                e.preventDefault();
            }
        });
    }
}

new MissionControl();
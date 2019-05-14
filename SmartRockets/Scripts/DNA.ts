/// <reference path="Command.ts" />

class DNA {
    public genes: Array<Command> = [];

    constructor(genes: Array<Command> = undefined) {
        if (genes) {
            this.genes = genes;
        }
        else {
            for (let i = 0; i < 1000; i++) {
                this.genes.push(this.randomCommand());
            }
        }
    }

    private randomCommand(): Command {
        let num = Math.floor(Math.random() * 4) + 1;

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
    }


    /**
     * Make a child out of two DNA objects.
     * @param partner
     */
    public crossover(partner: DNA, lastFrame: number): DNA {
        let childGenes = [];

        let mid = Math.floor(Math.random() * lastFrame);    // choose a midpoint within the number of frames that was ran.

        for (let i = 0; i < this.genes.length; i++) {
            if (i > mid) {
                childGenes.push(this.genes[i]);
            }
            else {
                childGenes.push(partner.genes[i]);
            }
        }

        return new DNA(childGenes);
    }

    public mutation(percent: number = 0.01): void {
        for (var i = 0; i < this.genes.length; i++) {
            if (Math.random() < percent) {
                this.genes[i] = this.randomCommand();
            }
        }
    }
}
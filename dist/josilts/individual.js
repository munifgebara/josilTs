"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const node_expression_1 = require("./node-expression");
class Individual {
    constructor(inputType, outputType, terminals, functions, maxHeigth = 4) {
        this.inputType = inputType;
        this.outputType = outputType;
        this.terminals = terminals;
        this.functions = functions;
        this.maxHeigth = maxHeigth;
        this.id = 0;
        this.fitness = 0;
        this.id = ++Individual.ID;
        this.rootExpression = new node_expression_1.NodeExpression("I" + this.id, this.inputType, "return a0;", [this.outputType], this.terminals, this.functions, maxHeigth, 0);
    }
    getValue(input) {
        return this.rootExpression.getValue(input);
    }
    writeDot() {
        fs.writeFileSync(`report/i${this.id}.dot`, this.rootExpression.getDot(), "utf-8");
    }
    writeCSV(targetValues) {
        let csv = "";
        csv += `x,F,PG\n`;
        targetValues.forEach(v => {
            let value = this.getValue({ x: v.x });
            csv += `${v.x},${v.f},${value}\n`;
        });
        fs.writeFileSync(`report/i${this.id}.csv`, csv, "utf-8");
    }
    updateFitness(targetValues) {
        this.fitness = 0;
        targetValues.forEach(v => {
            let dif = v.f - this.getValue({ x: v.x });
            this.fitness += (dif * dif);
        });
    }
}
Individual.ID = 0;
exports.Individual = Individual;
//# sourceMappingURL=individual.js.map
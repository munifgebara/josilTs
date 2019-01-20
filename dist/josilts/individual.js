"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const utils_1 = require("./utils");
const gp_node_1 = require("./gp-node");
class Individual {
    constructor(inputTypes, outputType, maxHeigth = 4) {
        this.inputTypes = inputTypes;
        this.outputType = outputType;
        this.maxHeigth = maxHeigth;
        this.id = ++Individual.ID;
        this.fitness = -1;
        this.rootExpression = new gp_node_1.GPNode(``, this.outputType, "return i0;", this.inputTypes);
        this.rootExpression.initChildren([new gp_node_1.GPNode("d", "EXTERNAL"), new gp_node_1.GPNode("w", "EXTERNAL")], maxHeigth);
    }
    getValue(input) {
        return this.rootExpression.value(input);
    }
    writeCSV(targetValues) {
        let csv = "";
        csv += `d,w,p,pg\n`;
        targetValues.forEach(v => {
            let value = this.getValue({ d: v.input[0], w: v.input[1] });
            csv += `${v.input[0]},${v.input[1]},${v.output},${value}\n`;
        });
        fs.writeFileSync(`report/i${this.id}.csv`, csv, "utf-8");
    }
    updateFitness(targetValues) {
        if (true) {
            this.fitness = 0;
            targetValues.forEach(v => {
                let dif = v.output - this.getValue({ d: v.input[0], w: v.input[1] });
                this.fitness += (dif * dif);
            });
        }
    }
    combine(other) {
        let s1 = new Individual(this.inputTypes, this.outputType, this.maxHeigth);
        s1.rootExpression = this.rootExpression.createCopy();
        let s2 = new Individual(other.inputTypes, other.outputType, other.maxHeigth);
        s2.rootExpression = other.rootExpression.createCopy();
        let s1fcs = s1.rootExpression.getAllFunctions();
        let a1 = s1fcs[utils_1.Utils.integerRandom(0, s1fcs.length - 1)];
        let s2fcs = s2.rootExpression.getAllFunctions();
        let a2 = s2fcs[utils_1.Utils.integerRandom(0, s2fcs.length - 1)];
        let i1 = utils_1.Utils.integerRandom(0, a1.children.length - 1);
        let i2 = utils_1.Utils.integerRandom(0, a2.children.length - 1);
        let aux = a1.children[i1].createCopy();
        a1.children[i1] = a2.children[i2].createCopy();
        a2.children[i2] = aux;
        return { s1, s2 };
    }
}
Individual.ID = 0;
exports.Individual = Individual;
//# sourceMappingURL=individual.js.map
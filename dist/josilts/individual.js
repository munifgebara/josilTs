"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const gp_node_1 = require("./gp-node");
class Individual {
    constructor(inputTypes, outputType, maxHeigth, nodes) {
        this.inputTypes = inputTypes;
        this.outputType = outputType;
        this.maxHeigth = maxHeigth;
        this.nodes = nodes;
        this.id = ++Individual.ID;
        this.fitness = -1;
        this.value = null;
        this.rootExpression = new gp_node_1.GPNode(``, "FUNCTION", this.outputType, "return i0;", [this.outputType], 0);
        this.rootExpression.initChildren(nodes, maxHeigth);
    }
    calculateValue(input) {
        let v = this.rootExpression.value(input, this.nodes);
        if (isNaN(v)) {
            return 1000;
        }
        return v;
    }
    writeCSV(name, targetValues, header = false) {
        let csv = "";
        if (header) {
            csv += `expressao,${this.rootExpression.getExpression()}\n`;
            csv += `parametros,${process.argv}\n`;
            csv += `i` + this.inputTypes.reduce((p, c) => p + "," + c.name, "") + `,output,pg,corretude\n`;
            targetValues.forEach((v, i) => {
                let value = this.calculateValue(v);
                csv += `${i + 1}${this.inputTypes.reduce((p, c) => p + ",    " + (v[c.name]), "")},${(v.output)},${(value)}} \n`;
            });
            fs.writeFileSync(`report/${name}.csv`, csv, "utf-8");
        }
    }
    updateFitness(targetValues) {
        this.fitness = 0;
        targetValues.forEach(v => {
            let value = this.calculateValue(v);
            let dif = v.output - value;
            this.fitness += (dif * dif);
        });
    }
}
Individual.ID = 0;
exports.Individual = Individual;
//# sourceMappingURL=individual.js.map
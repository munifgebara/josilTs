"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const utils_1 = require("./utils");
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
        this.parents = [];
        if (inputTypes[0].name == "CLONE") {
            return;
        }
        this.rootExpression = new gp_node_1.GPNode(``, "FUNCTION", this.outputType, "return i0;", [this.outputType], 0);
        this.rootExpression.initChildren(nodes, maxHeigth);
    }
    static getInstance(data) {
        let newInstance = new Individual([{ name: "CLONE", type: "NUMBER" }], data.outputType, data.maxHeigth, data.nodes);
        Object.assign(newInstance, data);
        newInstance.rootExpression = gp_node_1.GPNode.getInstance(data.rootExpression);
        newInstance.nodes = [];
        data.nodes.forEach(n => newInstance.nodes.push(gp_node_1.GPNode.getInstance(n)));
        return newInstance;
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
            csv += `i` + this.inputTypes.reduce((p, c) => p + "," + c.name, "") + `\n`;
        }
        targetValues.forEach((v, i) => {
            let value = this.calculateValue(v);
            csv += `${utils_1.Utils.fn(i + 1, 5, 0)} ${this.inputTypes.reduce((p, c) => p + "  " + utils_1.Utils.fn(parseFloat(v[c.name])), " ")} ${utils_1.Utils.fn(v.output)} ${utils_1.Utils.fn(value)} \n`;
        });
        fs.writeFileSync(`report/${name}.csv`, csv, "utf-8");
    }
    updateFitness(targetValues, force = false) {
        if (this.fitness > 0) {
            return this.fitness;
        }
        this.fitness = 0;
        let passo = Math.round(1 + targetValues.length / 100);
        let init = utils_1.Utils.integerRandom(0, passo);
        //console.log(init, passo - 1);
        //process.stdout.write(`${init} ${passo}  \r`);
        for (let i = init; i < targetValues.length; i += passo) {
            let v = targetValues[i];
            let value = this.calculateValue(v);
            let dif = Math.abs(v.output - value);
            if (dif > 1000000) {
                dif = 1000000;
            }
            this.fitness += dif / targetValues.length;
        }
        if (this.fitness == 0) {
            //this.fitness = 1000000;
        }
    }
    getInfo() {
        let fieldsOfInterest = ['id', 'outputType', 'inputTypes', 'fitness'];
        let info = fieldsOfInterest.reduce((p, c) => p + c.toUpperCase() + ":" + JSON.stringify(this[c]) + " ", "");
        info += `Number of Nodes:${this.nodes.length} `;
        info += `RootExpression:(${this.rootExpression.getInfo()})`;
        return info;
    }
}
Individual.ID = 0;
exports.Individual = Individual;
//# sourceMappingURL=individual.js.map
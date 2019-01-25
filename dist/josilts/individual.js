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
        this.rootExpression = new gp_node_1.GPNode(``, "FUNCTION", this.outputType, "return i0;", [this.outputType]);
        let nodes = [];
        inputTypes.forEach((c, i) => nodes.push(new gp_node_1.GPNode(c.name, "EXTERNAL", c.type)));
        this.rootExpression.initChildren(nodes, maxHeigth);
    }
    getValue(input) {
        let v = this.rootExpression.value(input);
        return v;
    }
    writeCSV(name, targetValues) {
        let csv = "";
        //csv += `expressao,${this.rootExpression.getExpression()}\n`;
        //csv += `parametros,${process.argv}\n`;
        //csv += `i` + this.inputTypes.reduce((p, c) => p + "," + c.name, "") + `,output,pg,corretude\n`;
        targetValues.forEach((v, i) => {
            let value = this.getValue(v);
            let c1 = Math.abs(value);
            let c2 = Math.abs(v.output);
            let corretude = c1 < c2 ? utils_1.Utils.round(c1 / c2) : utils_1.Utils.round(c2 / c1);
            csv += `${i + 1}${this.inputTypes.reduce((p, c) => p + ",    " + utils_1.Utils.round(v[c.name]), "")},    ${utils_1.Utils.round(v.output)},     ${utils_1.Utils.round(value)},    ${utils_1.Utils.round(corretude)} \n`;
        });
        fs.writeFileSync(`report/${name}_best.csv`, csv, "utf-8");
    }
    updateFitness(targetValues) {
        if (true) {
            this.fitness = 0;
            targetValues.forEach(v => {
                let value = this.getValue(v);
                //let corretude = Math.abs(Math.round(100 * (Math.abs(value) < Math.abs(v.output) ? value / v.output : v.output / value)) / 100);
                let dif = v.output - value;
                this.fitness += (dif * dif);
            });
        }
    }
    combine(other) {
        let s1 = new Individual(this.inputTypes, this.outputType, this.maxHeigth);
        // s1.rootExpression = this.rootExpression.createCopy();
        let s2 = new Individual(other.inputTypes, other.outputType, other.maxHeigth);
        // s2.rootExpression = other.rootExpression.createCopy();
        // let s1fcs: GPNode[] = s1.rootExpression.getAllChildrenWithChildren();
        // let a1 = s1fcs[Utils.integerRandom(0, s1fcs.length - 1)];
        // let s2fcs: GPNode[] = s2.rootExpression.getAllChildrenWithChildren();
        // let a2 = s2fcs[Utils.integerRandom(0, s2fcs.length - 1)];
        // let i1 = Utils.integerRandom(0, a1.children.length - 1);
        // let i2 = Utils.integerRandom(0, a2.children.length - 1);
        // let aux: GPNode = a1.children[i1].createCopy();
        // a1.children[i1] = a2.children[i2].createCopy();
        // a2.children[i2] = aux;
        let { i1, i2 } = gp_node_1.GPNode.combine(this.rootExpression, other.rootExpression);
        s1.rootExpression = i1;
        s2.rootExpression = i2;
        return { s1, s2 };
    }
}
Individual.ID = 0;
exports.Individual = Individual;
//# sourceMappingURL=individual.js.map
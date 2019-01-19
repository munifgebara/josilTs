"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const node_expression_1 = require("./node-expression");
class Individual {
    constructor(inputType, outputType, terminals, functions) {
        this.inputType = inputType;
        this.outputType = outputType;
        this.terminals = terminals;
        this.functions = functions;
        this.id = 0;
        this.id = ++Individual.ID;
        this.rootExpression = new node_expression_1.NodeExpression("I" + this.id, this.inputType, "return a0;", [this.outputType], this.terminals, this.functions, 5, 0);
    }
    getValue(input) {
        return this.rootExpression.getValue(input);
    }
    writeDot() {
        fs.writeFileSync(`report/i${this.id}.dot`, this.rootExpression.getDot(), "utf-8");
    }
}
Individual.ID = 0;
exports.Individual = Individual;
//# sourceMappingURL=individual.js.map
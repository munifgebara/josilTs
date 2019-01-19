"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tree_node_1 = require("./tree-node");
const utils_1 = require("./utils");
class NodeExpression extends tree_node_1.TreeNode {
    constructor(functionName, type, code, parametersTypes, terminals, functions, maxHeight = 4) {
        super(functionName, type);
        this.functionName = functionName;
        this.code = code;
        this.parametersTypes = parametersTypes;
        this.terminals = terminals;
        this.functions = functions;
        this.maxHeight = maxHeight;
        this.children = [];
        this.expression = `function ${this.name} ${this.parametersTypes.reduce((p, c, i) => p + "a" + i + (i < this.parametersTypes.length - 1 ? "," : ")"), "(")} {${this.code}}`;
        this.parametersTypes.forEach(pt => {
            let r = utils_1.Utils.integerRandom(0, maxHeight);
            if (r > 0) {
                let possibleFunctions = this.functions.filter(n => n.type == pt);
                let ne = possibleFunctions[utils_1.Utils.integerRandom(0, possibleFunctions.length - 1)];
                if (!ne) {
                    console.log("NAO ACHOU FUNCAO " + pt);
                }
                this.children.push(ne);
            }
            else {
                let possibleTerminals = this.terminals.filter(n => n.type == pt);
                let nn = possibleTerminals[utils_1.Utils.integerRandom(0, possibleTerminals.length - 1)];
                if (!nn) {
                    console.log("NAO ACHOU TERMINAL " + pt);
                }
                this.children.push(nn);
            }
        });
        this.name += `${this.children.reduce((p, c, i) => p + c.name + (i < this.children.length - 1 ? "," : ""), "(")})`;
    }
    getValue(input) {
        let ex = `${this.expression} ${this.functionName}${this.children.reduce((p, c, i) => p + c.getValue(input) + (i < this.children.length - 1 ? "," : ")"), "(")}`;
        return eval(ex);
    }
}
NodeExpression.id = 0;
exports.NodeExpression = NodeExpression;
//# sourceMappingURL=node-expression.js.map
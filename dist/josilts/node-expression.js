"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tree_node_1 = require("./tree-node");
const utils_1 = require("./utils");
class NodeExpression extends tree_node_1.TreeNode {
    constructor(functionName, type, code, parametersTypes, terminals, functions, maxHeight = 4, minHeight = 0) {
        super(functionName, type);
        this.functionName = functionName;
        this.code = code;
        this.parametersTypes = parametersTypes;
        this.terminals = terminals;
        this.functions = functions;
        this.maxHeight = maxHeight;
        this.minHeight = minHeight;
        this.children = [];
        this.desc = "" + this.functionName;
        this.expression = `function ${this.name} ${this.parametersTypes.reduce((p, c, i) => p + "a" + i + (i < this.parametersTypes.length - 1 ? "," : ")"), "(")} {${this.code}}`;
        for (let i = 0; i < this.parametersTypes.length; i++) {
            let pt = this.parametersTypes[i];
            let possibleFunctions = functions.filter(n => n.type == pt && n.minHeight <= maxHeight);
            let possibleTerminals = terminals.filter(n => n.type == pt);
            if (minHeight <= maxHeight && possibleFunctions.length > 0) {
                let ne = possibleFunctions[utils_1.Utils.integerRandom(0, possibleFunctions.length - 1)];
                this.children.push(new NodeExpression(`n_${ne.functionName}`, ne.type, ne.code, ne.parametersTypes, terminals, functions, maxHeight - 1));
            }
            else if (possibleTerminals.length > 0) {
                this.children.push(possibleTerminals[utils_1.Utils.integerRandom(0, possibleTerminals.length - 1)].newIntance());
            }
            else {
                console.log(`${functionName} ${possibleTerminals.length}/${terminals.length}   ${possibleFunctions.length}/${functions.length}  ${minHeight}<${maxHeight}`);
            }
        }
        this.name += `${this.children.reduce((p, c, i) => p + c.name + (i < this.children.length - 1 ? "," : ""), "(")})`;
    }
    getValue(input) {
        let ex = `${this.expression} ${this.functionName}${this.children.reduce((p, c, i) => p + c.getValue(input) + (i < this.children.length - 1 ? "," : ")"), "(")}`;
        return eval(ex);
    }
    getDot() {
        let dot = [` digraph G${this.id} {`];
        this.percorre(this, dot, 1);
        dot.push("}");
        return dot.reduce((p, c) => p + c + '\n', '');
    }
    getDotToCombine() {
        let dot = [];
        this.percorre(this, dot, 1);
        return dot.reduce((p, c) => p + c + '\n', '');
    }
    percorre(no, dot, h) {
        dot.push(`N${no.id} [label="${no.desc}"];`);
        if (no['children']) {
            no['children'].forEach(f => {
                dot.push(`N${no.id} -> N${f.id};`);
                this.percorre(f, dot, h + 1);
            });
        }
    }
    getNodesAsArray() {
        let toReturn = [];
        this.getNodes(toReturn, this);
        return toReturn;
    }
    getNodes(all, current) {
        all.push(current.copy());
        if (current['children']) {
            current['children'].forEach(c => {
                this.getNodes(all, c);
            });
        }
    }
    copy() {
        let n = new NodeExpression(`${this.functionName}`, this.type, this.code, this.parametersTypes, this.terminals, this.functions, this.maxHeight);
        n.children = [];
        this.children.forEach(c => n.children.push(c.copy()));
        return n;
    }
}
exports.NodeExpression = NodeExpression;
//# sourceMappingURL=node-expression.js.map
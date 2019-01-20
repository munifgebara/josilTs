"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class GPNode {
    constructor(name, returnType, code = utils_1.Utils.floatRandom(-10, 10).toString(), inputTypes = [], minimumHeight = 0) {
        this.name = name;
        this.returnType = returnType;
        this.code = code;
        this.inputTypes = inputTypes;
        this.minimumHeight = minimumHeight;
        this.children = [];
        this.id = ++GPNode.ID;
        this.initNode();
    }
    static getNumberConstantNode() {
        return new GPNode("CONSTANT", "NUMBER");
    }
    static getNumberConstantNodes(quantity) {
        let toReturn = [];
        for (let i = 0; i < quantity; i++) {
            toReturn.push(new GPNode("CONSTANT", "NUMBER"));
        }
        return toReturn;
    }
    static getGenericFunctions() {
        let toReturn = [];
        toReturn.push(new GPNode("add", "NUMBER", "return i0+i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("sub", "NUMBER", "return i0-i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("mul", "NUMBER", "return i0*i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("div", "NUMBER", "return i1==0?1:i0/i1;", ["NUMBER", "NUMBER"]));
        //        toReturn.push(new GPNode("sqr", "NUMBER", "return i0*i0;", ["NUMBER"]));
        //      toReturn.push(new GPNode("sqr3", "NUMBER", "return i0*i0*i0;", ["NUMBER"]));
        toReturn.push(new GPNode("mod", "NUMBER", "return i1==0?i0:i0%i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("gt", "NUMBER", "return i0>=i1?i0:i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("lt", "NUMBER", "return i0<=i1?i0:i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("domingo", "NUMBER", "return Math.round(i0-1)==0?0:i0;", ["NUMBER"]));
        toReturn.push(new GPNode("sabado", "NUMBER", "return Math.round(i0-7)==0?i0/2:i0;", ["NUMBER"]));
        toReturn.push(new GPNode("diaDeSemana", "NUMBER", "return (i0>1 && i0<7)?i0:0;", ["NUMBER"]));
        return toReturn;
    }
    static generateFunctions(functions = GPNode.getGenericFunctions()) {
        return functions.reduce((p, c) => p + c.getFunction(), "");
    }
    createCopy() {
        let ni = new GPNode(this.name, this.returnType, this.code, this.inputTypes, this.minimumHeight);
        ni.children = [];
        this.children.forEach(c => ni.children.push(c.createCopy()));
        return ni;
    }
    getFunction() {
        const cInputs = this.inputTypes.length;
        return `function ${this.name}(${this.inputTypes.reduce((p, c, i) => p + 'i' + i + (i < cInputs - 1 ? ',' : ''), "")}){\n ${this.code}\n}\n`;
    }
    getExpression(externals = {}) {
        if (this.children.length == 0) {
            return this.code;
        }
        const cInputs = this.inputTypes.length;
        return `${this.name}(${this.children.reduce((p, c, i) => p + c.getExpression() + (i < cInputs - 1 ? ',' : ''), "")})`;
    }
    initChildren(nodes, maxHeigth = 4) {
        this.children = [];
        let possibleLeafs = [...GPNode.getNumberConstantNodes(this.inputTypes.length), ...nodes.filter(n => (n.returnType == "EXTERNAL"))];
        let functions = GPNode.getGenericFunctions();
        let all = [...possibleLeafs, ...functions];
        this.inputTypes.forEach(type => {
            if (maxHeigth > 1) {
                let nc = functions[utils_1.Utils.integerRandom(0, functions.length - 1)].createCopy();
                nc.initChildren(nodes, maxHeigth - 1);
                this.children.push(nc);
            }
            else if (maxHeigth == 1) {
                let nc = all[utils_1.Utils.integerRandom(0, all.length - 1)].createCopy();
                nc.initChildren(nodes, maxHeigth - 1);
                this.children.push(nc);
            }
            else {
                let nc = possibleLeafs[utils_1.Utils.integerRandom(0, possibleLeafs.length - 1)].createCopy();
                this.children.push(nc);
            }
        });
    }
    initNode() {
        if (this.returnType == "EXTERNAL") {
            this.code = `externals['${this.name}']`;
        }
    }
    value(externals) {
        return eval(GPNode.generateFunctions() + this.getExpression());
    }
    getDot() {
        let dot = [` digraph G${this.id} {`];
        this.buildDot(this, dot);
        dot.push("}");
        return dot.reduce((p, c) => p + c + '\n', '');
    }
    getDotToCombine() {
        let dot = [];
        this.buildDot(this, dot);
        return dot.reduce((p, c) => p + c + '\n', '');
    }
    buildDot(current, dot) {
        dot.push(`N${current.id} [label="${current.label()}"];`);
        current.children.forEach(n => {
            dot.push(`N${current.id} -> N${n.id};`);
            this.buildDot(n, dot);
        });
    }
    addFunctions(current, all) {
        if (current.children.length > 0) {
            all.push(current);
            current.children.forEach(c => this.addFunctions(c, all));
        }
    }
    getAllFunctions() {
        let tr = [];
        this.addFunctions(this, tr);
        return tr;
    }
    label() {
        return `${this.name != "CONSTANT" ? this.name : this.code}`;
    }
}
GPNode.ID = 0;
exports.GPNode = GPNode;
//# sourceMappingURL=gp-node.js.map
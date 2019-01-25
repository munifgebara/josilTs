"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const project_1 = require("./project");
class GPNode {
    constructor(name, behavior, returnType, code = "", inputTypes = [], minimumHeight = 0) {
        this.name = name;
        this.behavior = behavior;
        this.returnType = returnType;
        this.code = code;
        this.inputTypes = inputTypes;
        this.minimumHeight = minimumHeight;
        this.dotStyle = "filled";
        this.children = [];
        this.id = ++GPNode.ID;
        this.h = 0;
        this.initNode();
    }
    static getNumberConstantNode(min = -1, max = 1) {
        let c = new GPNode("New Constant", "CONSTANT", "NUMBER");
        c.code = (min + (Math.random() * (max - min))).toString();
        return c;
    }
    static getNumberConstantNodes(quantity, min = -1, max = 1) {
        let toReturn = [];
        for (let i = 0; i < quantity; i++) {
            toReturn.push(GPNode.getNumberConstantNode(min, max));
        }
        return toReturn;
    }
    static getGenericFunctions() {
        let toReturn = [];
        toReturn.push(new GPNode("add", "FUNCTION", "NUMBER", "return i0+i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("sub", "FUNCTION", "NUMBER", "return i0-i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("mul", "FUNCTION", "NUMBER", "return i0*i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("div", "FUNCTION", "NUMBER", "return i1==0?1:i0/i1;", ["NUMBER", "NUMBER"]));
        // toReturn.push(new GPNode("and", "FUNCTION", "BOOLEAN", "return i0&&i1;", ["BOOLEAN", "BOOLEAN"]));
        // toReturn.push(new GPNode("or", "FUNCTION", "BOOLEAN", "return i0||i1;", ["BOOLEAN", "BOOLEAN"]));
        // toReturn.push(new GPNode("not", "FUNCTION", "BOOLEAN", "return !i0;", ["BOOLEAN"]));
        //toReturn.push(new GPNode("ifthenelse", "FUNCTION", "NUMBER", "return i0?i1:i2;", ["BOOLEAN", "NUMBER", "NUMBER"]));
        // toReturn.push(new GPNode("gt", "FUNCTION", "BOOLEAN", "return i0>i1;", ["NUMBER", "NUMBER"]));
        // toReturn.push(new GPNode("lt", "FUNCTION", "BOOLEAN", "return i0<i1;", ["NUMBER", "NUMBER"]));
        // toReturn.push(new GPNode("sqr", "FUNCTION", "NUMBER", "return i0*i0;", ["NUMBER"]));
        // toReturn.push(new GPNode("sin", "FUNCTION", "NUMBER", "return Math.sin(i0);", ["NUMBER"]));
        // toReturn.push(new GPNode("sqr3", "FUNCTION", "NUMBER", "return i0*i0*i0;", ["NUMBER"]));
        // toReturn.push(new GPNode("mod", "FUNCTION", "NUMBER", "return i1==0?i0:i0%i1;", ["NUMBER", "NUMBER"]));
        // toReturn.push(new GPNode("gt", "FUNCTION", "NUMBER", "return i0>=i1?i0:i1;", ["NUMBER", "NUMBER"]));
        // toReturn.push(new GPNode("lt", "FUNCTION", "NUMBER", "return i0<=i1?i0:i1;", ["NUMBER", "NUMBER"]));
        return toReturn;
    }
    static generateFunctions(functions = GPNode.getGenericFunctions()) {
        if (!GPNode.FUNCTIONS) {
            GPNode.FUNCTIONS = functions.reduce((p, c) => p + c.getFunction(), "");
        }
        return this.FUNCTIONS;
    }
    static combine(gpFunction2, gpFunction3) {
        let gpFunction4 = gpFunction2.createCopy();
        let gpFunction5 = gpFunction3.createCopy();
        let c1 = gpFunction4.getAllChildrenWithChildren();
        let c2 = gpFunction5.getAllChildrenWithChildren();
        let count1 = 0;
        let n1 = c1[1 + Math.round(c1.length / 2)];
        let n2 = c2[1 + Math.round(c2.length / 2)];
        while (count1 < c1.length * c2.length) {
            let i1 = utils_1.Utils.indexRandom(n1.children);
            let n1c = n1.children[i1];
            let i2 = utils_1.Utils.indexRandom(n2.children);
            let n2c = n2.children[i2];
            if (n1c.returnType == n2c.returnType) {
                n1.dotStyle = "solid";
                n2.dotStyle = "solid";
                n1c.dotStyle = "dashed";
                n2c.dotStyle = "dashed";
                n1.children[i1] = n2c;
                n2.children[i2] = n1c;
                if (Math.random() < 0.01) {
                    project_1.Project.mutate(gpFunction4);
                }
                if (Math.random() < 0.01) {
                    project_1.Project.mutate(gpFunction5);
                }
                return { i1: gpFunction4, i2: gpFunction5 };
            }
            n1 = c1[utils_1.Utils.indexRandom(c1)];
            n2 = c2[utils_1.Utils.indexRandom(c2)];
            count1++;
        }
        if (Math.random() < 0.5) {
            project_1.Project.mutate(gpFunction4);
        }
        if (Math.random() < 0.5) {
            project_1.Project.mutate(gpFunction5);
        }
        return { i1: gpFunction4, i2: gpFunction5 };
    }
    createCopy() {
        let ni = new GPNode(this.name, this.behavior, this.returnType, this.code, this.inputTypes, this.minimumHeight);
        ni.children = [];
        this.children.forEach(c => ni.children.push(c.createCopy()));
        return ni;
    }
    initNode() {
        if (this.behavior == "EXTERNAL") {
            this.code = `externals['${this.name}']`;
        }
        else if (this.behavior == "CONSTANT" && !this.code) {
            let v = Math.random();
            this.code = v.toString();
            this.name = (Math.round(v * 100) / 100).toString();
        }
    }
    getFunction() {
        const cInputs = this.inputTypes.length;
        return `function ${this.name}(${this.inputTypes.reduce((p, c, i) => p + 'i' + i + (i < cInputs - 1 ? ',' : ''), "")}){\n ${this.code}\n}\n`;
    }
    getExpression(externals = {}) {
        if (this.behavior == "CONSTANT" || this.behavior == "EXTERNAL") {
            return this.code;
        }
        const cInputs = this.inputTypes.length;
        return `${this.name}(${this.children.reduce((p, c, i) => p + c.getExpression() + (i < cInputs - 1 ? ',' : ''), "")})`;
    }
    initChildren(nodes, maxHeigth = 4) {
        this.children = [];
        this.inputTypes.forEach(type => {
            let externals = nodes.filter(f => f.behavior == "EXTERNAL" && f.returnType == type);
            let possibileFunctions = GPNode.getGenericFunctions().filter(f => f.returnType == type);
            if (possibileFunctions && (maxHeigth >= 1 || externals.length == 0)) {
                let nc = possibileFunctions[utils_1.Utils.integerRandom(0, possibileFunctions.length - 1)].createCopy();
                nc.initChildren(nodes, maxHeigth - 1);
                this.children.push(nc);
            }
            else if (type == "NUMBER" && Math.random() > 0.5) {
                this.children.push(GPNode.getNumberConstantNode());
            }
            else {
                this.children.push(externals[utils_1.Utils.integerRandom(0, externals.length - 1)].createCopy());
            }
        });
    }
    value(externals) {
        return eval(GPNode.generateFunctions() + this.getExpression());
    }
    getDot(s = "s") {
        let dot = [` digraph G${this.id} {`];
        this.buildDot(this, dot);
        dot.push("}");
        dot[1] = dot[1].replace(`label=""`, `label="${s}"`);
        return dot.reduce((p, c) => p + c + '\n', '');
    }
    getDotToCombine() {
        let dot = [];
        this.buildDot(this, dot);
        return dot.reduce((p, c) => p + c + '\n', '');
    }
    buildDot(current, dot) {
        dot.push(`N${current.id}[ style=${current.dotStyle}  label="${current.label()}"];`);
        current.children.forEach(n => {
            dot.push(`N${current.id} -> N${n.id};`);
            this.buildDot(n, dot);
        });
    }
    addChildrenWithChildren(current, all) {
        if (current.children.length > 0) {
            all.push(current);
            current.children.forEach(c => this.addChildrenWithChildren(c, all));
        }
    }
    getAllChildrenWithChildren() {
        let tr = [];
        this.addChildrenWithChildren(this, tr);
        return tr;
    }
    label() {
        return `${this.name ? this.name : "N" + this.id}`;
    }
    height() {
        if (this.h > 0) {
            return this.h;
        }
        if (this.children.length == 0) {
            this.h = 1;
            return 1;
        }
        else {
            let max = 0;
            this.children.forEach(c => {
                let al = c.height();
                if (al > max) {
                    max = al;
                }
            });
            this.h = 1 + max;
            return 1 + max;
        }
    }
}
GPNode.ID = 0;
exports.GPNode = GPNode;
//# sourceMappingURL=gp-node.js.map
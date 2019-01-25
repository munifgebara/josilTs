"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const support_1 = require("./support");
class GPNode {
    constructor(name, behavior, returnType, code = "NOOP", inputTypes, minimumHeight) {
        this.name = name;
        this.behavior = behavior;
        this.returnType = returnType;
        this.code = code;
        this.inputTypes = inputTypes;
        this.minimumHeight = minimumHeight;
        this.dotStyle = "filled";
        this.children = [];
        this.id = ++GPNode.ID;
        this.h = 1;
        this.initNode();
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
        else if (this.behavior == "CONSTANT" && this.code == "NOOP") {
            let v = Math.random();
            this.code = v.toString();
            this.name = v.toString();
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
        let higest = 1;
        this.inputTypes.forEach(type => {
            let externals = nodes.filter(f => f.behavior == "EXTERNAL" && f.returnType == type);
            let possibileFunctions = nodes.filter(f => f.behavior == "FUNCTION" && f.returnType == type);
            if (possibileFunctions && (maxHeigth >= 1)) {
                let nc = possibileFunctions[utils_1.Utils.indexRandom(possibileFunctions)].createCopy();
                nc.initChildren(nodes, maxHeigth - 1);
                if (nc.h > higest) {
                    higest = nc.h;
                }
                this.children.push(nc);
            }
            else if (externals.length > 0) {
                this.children.push(externals[utils_1.Utils.integerRandom(0, externals.length - 1)].createCopy());
            }
            else {
                this.children.push(support_1.Support.getConstantNode(type));
            }
        });
        this.h += higest;
    }
    value(externals, nodes) {
        return eval(support_1.Support.generateFunctions(nodes) + this.getExpression());
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
        dot.push(`N${current.id}[ style="${current.dotStyle}"  label="${current.label()}"];`);
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
        let label = `${this.name ? this.name : "N" + this.id}`;
        return label.length < 5 ? label : label.substr(0, 5) + "...";
    }
    updateH() {
        if (this.children.length == 0) {
            this.h = 1;
        }
        else {
            let max = 0;
            this.children.forEach(c => {
                c.updateH();
                if (c.h > max) {
                    max = c.h;
                }
            });
            this.h = 1 + max;
        }
    }
}
GPNode.ID = 0;
exports.GPNode = GPNode;
//# sourceMappingURL=gp-node.js.map
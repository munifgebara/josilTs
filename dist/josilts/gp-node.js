"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const support_1 = require("./support");
class GPNode {
    constructor(name, behavior, returnType, code = "NOOP", inputTypes = [], minimumHeight = 0, simpleExpression = null) {
        this.name = name;
        this.behavior = behavior;
        this.returnType = returnType;
        this.code = code;
        this.inputTypes = inputTypes;
        this.minimumHeight = minimumHeight;
        this.simpleExpression = simpleExpression;
        this.dotStyle = "filled";
        this.children = [];
        this.id = ++GPNode.ID;
        this.h = 1;
        GPNode.ALL.push(this);
        if (name == "CLONE") {
            return;
        }
        if (simpleExpression == null) {
            this.simpleExpression = "(" + utils_1.Utils.replaceAll(utils_1.Utils.replaceAll(code, "return ", ""), ";", "") + ")";
        }
        this.initNode();
    }
    static getInstance(data) {
        let newInstance = new GPNode("CLONE", "FUNCTION", "NUMBER");
        Object.assign(newInstance, data);
        newInstance.children = [];
        data.children.forEach(c => newInstance.children.push(GPNode.getInstance(c)));
        return newInstance;
    }
    createCopy() {
        let code = this.behavior == "CONSTANT" ? "NOOP" : this.code;
        let ni = new GPNode(this.name, this.behavior, this.returnType, code, this.inputTypes, this.minimumHeight);
        if (this.behavior == "CONSTANT") {
            ni.code = this.code;
            ni.name = this.code;
        }
        ni.children = [];
        this.children.forEach(c => ni.children.push(c.createCopy()));
        return ni;
    }
    initNode() {
        if (this.behavior == "EXTERNAL") {
            this.code = `externals['${this.name}']`;
        }
        else if (this.behavior == "CONSTANT" && this.code == "NOOP") {
            let v = utils_1.Utils.random();
            this.code = v.toString();
            this.name = v.toString();
        }
    }
    isPureConstant() {
        if (this.behavior == "CONSTANT") {
            return true;
        }
        if (this.behavior == "EXTERNAL") {
            return false;
        }
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].behavior != "CONSTANT") {
                return false;
            }
        }
        return true;
    }
    getEquivalentConstant() {
        // if (this.isPureConstant()) {
        //     if (Support.getSimpleExpression(this).indexOf("externals")>=0){
        //         return this;
        //     }
        //     return new GPNode("", "CONSTANT", this.returnType, "" + eval(Support.getSimpleExpression(this)));
        // }
        return this;
    }
    simplify() {
        this.children.forEach((ccc, i) => this.children[i] = ccc.getEquivalentConstant());
    }
    deepSimplify() {
        this.children.forEach(c => c.deepSimplify());
        this.simplify();
        return this;
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
            if (possibileFunctions && (maxHeigth > 2)) {
                let nc = possibileFunctions[utils_1.Utils.indexRandom(possibileFunctions)].createCopy();
                nc.initChildren(nodes, maxHeigth - 1);
                this.children.push(nc);
                if (nc.h > higest) {
                    higest = nc.h;
                }
            }
            else if (maxHeigth > 1) {
                let allNodes = [...possibileFunctions, ...externals, ...support_1.Support.getConstantNodes(4, type)];
                let nc = allNodes[utils_1.Utils.indexRandom(allNodes)].createCopy();
                if (nc.behavior == "FUNCTION") {
                    nc.initChildren(nodes, maxHeigth - 1);
                }
                this.children.push(nc);
                if (nc.h > higest) {
                    higest = nc.h;
                }
            }
            else {
                let allNodes = [...externals, ...support_1.Support.getConstantNodes(externals.length + 1, type)];
                let nc = allNodes[utils_1.Utils.indexRandom(allNodes)].createCopy();
                this.children.push(nc);
            }
        });
        this.h += higest;
    }
    value(externals, nodes) {
        return eval(support_1.Support.getSimpleExpression(this)); //eval(Support.generateFunctions(nodes) + this.getExpression());
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
        tr.shift();
        return tr;
    }
    label() {
        let label = `${this.name ? this.name : "N" + this.id}`;
        return label.length < 5 ? label : (label.substr(0, 8) + "...");
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
    getInfo() {
        let fieldsOfInterest = ['id', 'name', 'behavior', 'h', 'returnType', 'inputTypes'];
        let info = fieldsOfInterest.reduce((p, c) => p + c.toUpperCase() + ":" + this[c] + " ", "");
        info += `Number of children:${this.children.length} `;
        if (this.getExpression())
            info += `RootExpression:(${this.getExpression().substr(0, 20)}...)`;
        return info;
    }
}
GPNode.ALL = [];
GPNode.ID = 0;
exports.GPNode = GPNode;
//# sourceMappingURL=gp-node.js.map
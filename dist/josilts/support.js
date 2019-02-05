"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');
const gp_node_1 = require("./gp-node");
const utils_1 = require("./utils");
const individual_1 = require("./individual");
class Support {
    static createExternalParametersFromTargetValues(csv) {
        let fields = Object.keys(csv[0]);
        return fields.filter(f => f != "index" && f != "output").reduce((p, c) => [...p, { name: c, type: "NUMBER" }], []);
    }
    static getConstantNode(type) {
        const toReturn = new gp_node_1.GPNode(type + " Constant", "CONSTANT", type, ``, [], 0);
        switch (type) {
            case "BOOLEAN":
                toReturn.code = "" + (utils_1.Utils.random() > 0.5);
                break;
            case "NUMBER":
                toReturn.code = "" + utils_1.Utils.random();
                break;
            case "STRING":
                toReturn.code = "String";
                break;
        }
        return toReturn;
    }
    static getConstantNodes(quantity, type = "NUMBER") {
        let toReturn = [];
        for (let i = 0; i < quantity; i++) {
            toReturn.push(Support.getConstantNode(type));
        }
        return toReturn;
    }
    static getBasicMatematicalFunctions() {
        let toReturn = [];
        toReturn.push(new gp_node_1.GPNode("add", "FUNCTION", "NUMBER", "return i0+i1;", ["NUMBER", "NUMBER"], 0, "(i0+i1)"));
        toReturn.push(new gp_node_1.GPNode("sub", "FUNCTION", "NUMBER", "return i0-i1;", ["NUMBER", "NUMBER"], 0, "(i0-i1)"));
        toReturn.push(new gp_node_1.GPNode("mul", "FUNCTION", "NUMBER", "return i0*i1;", ["NUMBER", "NUMBER"], 0, "(i0*i1)"));
        //toReturn.push(new GPNode("div", "FUNCTION", "NUMBER", "return i1==0?1:i0/i1;", ["NUMBER", "NUMBER"], 0, "(i1==0?1:i0/i1)"));
        //toReturn.push(new GPNode("mod", "FUNCTION", "NUMBER", "return i1==0?i0:i0%i1;", ["NUMBER", "NUMBER"], 0, "(i1==0?i0:i0%i1)"));
        return toReturn;
    }
    static getLogicalFunctions() {
        let toReturn = [];
        toReturn.push(new gp_node_1.GPNode("and", "FUNCTION", "BOOLEAN", "return i0&&i1;", ["BOOLEAN", "BOOLEAN"], 0, "(i0&&i1)"));
        toReturn.push(new gp_node_1.GPNode("or", "FUNCTION", "BOOLEAN", "return i0||i1;", ["BOOLEAN", "BOOLEAN"], 0, "(i0||i1)"));
        toReturn.push(new gp_node_1.GPNode("not", "FUNCTION", "BOOLEAN", "return !i0;", ["BOOLEAN"], 0, "(!i0)"));
        toReturn.push(new gp_node_1.GPNode("ifthenelse", "FUNCTION", "NUMBER", "return i0?i1:i2;", ["BOOLEAN", "NUMBER", "NUMBER"], 0, "(i0?i1:i2)"));
        return toReturn;
    }
    static getRelationalFunctions() {
        let toReturn = [];
        //toReturn.push(new GPNode("gt", "FUNCTION", "BOOLEAN", "return i0>i1;", ["NUMBER", "NUMBER"], 0, "(i0>i1)"));
        //toReturn.push(new GPNode("lt", "FUNCTION", "BOOLEAN", "return i0<i1;", ["NUMBER", "NUMBER"], 0, "(i0<i1)"));
        toReturn.push(new gp_node_1.GPNode("numberGt", "FUNCTION", "NUMBER", "return i0>=i1?i0:i1;", ["NUMBER", "NUMBER"], 0, "(i0>=i1?i0:i1)"));
        toReturn.push(new gp_node_1.GPNode("numberLt", "FUNCTION", "NUMBER", "return i0<=i1?i0:i1;", ["NUMBER", "NUMBER"], 0, "(i0<=i1?i0:i1)"));
        return toReturn;
    }
    static getAdvancedMatematicalFunctions() {
        let toReturn = [];
        //toReturn.push(new GPNode("sqr", "FUNCTION", "NUMBER", "return i0*i0;", ["NUMBER"], 0, "(i0*i0)"));
        toReturn.push(new gp_node_1.GPNode("sin", "FUNCTION", "NUMBER", "return i1*Math.sin(i0);", ["NUMBER", "NUMBER"], 0, "(i1*Math.sin(i0))"));
        //toReturn.push(new GPNode("atan", "FUNCTION", "NUMBER", "return Math.atan(i0);", ["NUMBER"], 0,"(i1*Math.atan(i0))"));
        //toReturn.push(new GPNode("exp", "FUNCTION", "NUMBER", "return Math.exp(i0);", ["NUMBER"], 0,,"Math.exp(i0)"));
        toReturn.push(new gp_node_1.GPNode("log", "FUNCTION", "NUMBER", "return Math.log(Math.abs(i0));", ["NUMBER"], 0, "Math.log(Math.abs(i0))"));
        //toReturn.push(new GPNode("sqr3", "FUNCTION", "NUMBER", "return i0*i0*i0;", ["NUMBER"], 0,,"(i0+i0*i0)"));
        return toReturn;
    }
    static generateFunctions(functions = Support.getBasicMatematicalFunctions()) {
        return functions.filter(g => g.behavior == "FUNCTION").reduce((p, c) => p + c.getFunction(), "");
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
            n1 = c1[utils_1.Utils.indexRandom(c1)];
            n2 = c2[utils_1.Utils.indexRandom(c2)];
            let i1 = utils_1.Utils.indexRandom(n1.children);
            let n1c = n1.children[i1];
            let i2 = utils_1.Utils.indexRandom(n2.children);
            let n2c = n2.children[i2];
            if (n1c.returnType == n2c.returnType) {
                n1.dotStyle = "solid";
                n2.dotStyle = "dashed";
                n1c.dotStyle = "solid";
                n2c.dotStyle = "dashed";
                n1.children[i1] = n2c;
                n2.children[i2] = n1c;
                if (utils_1.Utils.random() < 0.01) {
                    //Project.mutate(gpFunction4);
                }
                if (utils_1.Utils.random() < 0.01) {
                    //Project.mutate(gpFunction5);
                }
                /*
                                let dot = `digraph Population_${gpFunction2.id}__${gpFunction3.id} {\n`;
                                dot += gpFunction2.getDotToCombine() + "\n";
                                dot += gpFunction3.getDotToCombine() + "\n";
                                dot += gpFunction4.getDotToCombine() + "\n";
                                dot += gpFunction5.getDotToCombine() + "\n";
                
                                dot += "}\n";
                                fs.writeFileSync(`pop/C_${gpFunction2.id}__${gpFunction3.id}.dot`, dot);
                */
                return { i1: gpFunction4, i2: gpFunction5 };
            }
            count1++;
        }
        if (utils_1.Utils.random() < 0.5) {
            //Project.mutate(gpFunction4);
        }
        if (utils_1.Utils.random() < 0.5) {
            //Project.mutate(gpFunction5);
        }
        return { i1: gpFunction4, i2: gpFunction5 };
    }
    static mixIndividuals(individual1, individual2) {
        let s1 = new individual_1.Individual(individual1.inputTypes, individual1.outputType, individual1.maxHeigth, individual1.nodes);
        let s2 = new individual_1.Individual(individual2.inputTypes, individual2.outputType, individual2.maxHeigth, individual2.nodes);
        let { i1, i2 } = Support.combine(individual1.rootExpression, individual2.rootExpression);
        s1.rootExpression = i1;
        s2.rootExpression = i2;
        return { s1, s2 };
    }
    static mutate(gpFunction5) {
        let pt = gpFunction5;
        let prox = pt.children[0];
        let h = 0;
        while (pt.children.length > 0 && h < 2) {
            let pi = utils_1.Utils.indexRandom(pt.children);
            let prox = pt.children[pi];
            pt = prox;
            h++;
        }
        pt.dotStyle = "rounded,filled";
        if (prox.children.length > 0 && pt.returnType == prox.returnType && pt.children.length == prox.children.length) {
            [prox.name, prox.code, pt.name, pt.code] = [pt.name, pt.code, prox.name, prox.code];
        }
    }
    static writeSVGToDisk(fileName, dot) {
        Support.viz.renderString(dot)
            .then(result => {
            fs.writeFileSync(fileName, result, "utf-8");
        })
            .catch(error => {
            Support.viz = new Viz({ Module, render });
            console.error("ERROR:" + error + "\n");
        });
    }
    static readCSV(name) {
        let l = [];
        let data = fs.readFileSync(name).toString().split("\n");
        let fields = data[0].replace("\r", "").split(",");
        for (let i = 1; i < data.length; i++) {
            let row = data[i].replace("\r", "").split(",");
            let obj = { index: i };
            fields.forEach((f, j) => obj[f] = parseFloat(row[j]));
            if (obj[fields[0]]) {
                l.push(obj);
            }
        }
        console.log(`${l.length} rows imported`);
        return l;
    }
    static createTargetValuesFromCSV(filename) {
        let targetValues = [];
        let ss = Support.readCSV(filename);
        ss.forEach(s => {
            targetValues.push(s);
        });
        return targetValues;
    }
    static evalExpressionWithParameters(expression, currentValues) {
        let keys = Object.keys(currentValues);
        let s = `(function (${keys.reduce((p, c, i) => p + c + (i < keys.length - 1 ? ',' : ''), '')})` +
            `{return ${expression}})` +
            `(${keys.reduce((p, c, i) => p + currentValues[c].toString() + (i < keys.length - 1 ? ',' : ''), "")})`;
        return eval(s);
    }
    static createTargetValuesFromExpression(externalParameters, expression, min = -10, max = 10, step = .5) {
        let targetValues = [];
        let cv = {};
        let i = 1;
        let cp = 0;
        externalParameters.forEach(ep => cv[ep.name] = min);
        while (cp < externalParameters.length) {
            let output = this.evalExpressionWithParameters(expression, cv);
            targetValues.push(Object.assign({ i, output }, cv));
            cp = 0;
            let continua = true;
            while (continua && cp < externalParameters.length) {
                cv[externalParameters[cp].name] = cv[externalParameters[cp].name] + step;
                if (cv[externalParameters[cp].name] > max) {
                    cv[externalParameters[cp].name] = min;
                    cp++;
                    continua = true;
                }
                else {
                    continua = false;
                }
            }
            i++;
        }
        return targetValues;
    }
    static getSimpleExpression2(node) {
        let ex = utils_1.Utils.replaceAll(utils_1.Utils.replaceAll(Support.getSimpleExpression(node), "externals['", ""), "']", "");
        // while (ex[0] == "(" && ex[ex.length - 1] == ")") {
        //     console.log(ex);
        //     ex = ex.substr(1, ex.length - 2);
        // }
        return ex;
    }
    static getSimpleExpression(node) {
        if (node.behavior == "CONSTANT") {
            return node.code;
        }
        if (node.behavior == "EXTERNAL") {
            return node.code;
        }
        let e = node.simpleExpression;
        node.children.forEach((c, i) => {
            e = utils_1.Utils.replaceAll(e, 'i' + i, Support.getSimpleExpression(c));
        });
        //return `${this.name}(${this.children.reduce((p, c, i) => p + c.getExpression() + (i < cInputs - 1 ? ',' : ''), "")})`;
        return utils_1.Utils.replaceAll(e, "--", "+");
    }
    static readIndividual(initialPopulation, name) {
        if (fs.existsSync(name)) {
            let ind = individual_1.Individual.getInstance(JSON.parse(fs.readFileSync(name).toString()));
            //ind.rootExpression.children[0].deepSimplify();
            ind.fitness = -1;
            initialPopulation.push(ind);
        }
    }
}
Support.tenArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
Support.viz = new Viz({ Module, render });
exports.Support = Support;
//# sourceMappingURL=support.js.map
import * as fs from 'fs';
import * as stringify from "json-stable-stringify";
import { Utils } from "./josilts/utils";
import { Project } from './josilts/project';
import { Individual } from './josilts/individual';
import { GPNode } from './josilts/gp-node';

console.log("teste");



function testaProject() {


    let project = new Project("f2", "NUMBER", "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));

    for (let x = -10; x <= 10; x += 0.5) {
        project.targetValues.push({ x, f: x * x + 2 * x - 3 });
    }
    let best = project.population[0];
    for (let ge = 0; ge <= parseInt(process.argv[4]); ge++) {
        console.log("\nOffspring ", ge);;
        best = project.getBest();
        fs.writeFileSync(`report/best.dot`, best.rootExpression.getDot(), "utf-8");
        fs.writeFileSync(`report/pior.dot`, project.population[project.populationSize - 1], "utf-8");
        project.evolve();
    }
    console.log(parseInt(process.argv[2]), parseInt(process.argv[3]), best.fitness);
    project.targetValues = [];
    for (let x = -10; x <= 15; x += 0.1) {
        project.targetValues.push({ x, f: x * x + 2 * x - 3 });
    }
    best.writeCSV(project.targetValues);

}

function testaCombina() {

    let mate1 = new Individual("NUMBER", "NUMBER", parseInt(process.argv[2]));
    let mate2 = new Individual("NUMBER", "NUMBER", parseInt(process.argv[2]));

    let { s1, s2 } = { ...mate1.combine(mate2) };
    fs.writeFileSync(`report/mates.dot`, " digraph G20 {" + mate1.rootExpression.getDotToCombine() + s1.rootExpression.getDotToCombine() + mate2.rootExpression.getDotToCombine() + s2.rootExpression.getDotToCombine() + "}", "utf-8");


    [s1, s2, mate1, mate2].forEach(i => {
        let v = i.getValue({ x: 10 });
        console.log(v);
        if (v == 0 && false) {
            fs.writeFileSync("report/erro.json", stringify(i, { space: '  ' }), "utf-8");
            process.exit(1);
        }
    });









}
function testaGpNode() {
    //let fs = GPNode.generateFunctions() + "console.log(add(1, 3))";


    let node: GPNode = new GPNode("", "NUMBER", "return i0;", ["NUMBER"]);
    node.initChildren([new GPNode("x", "EXTERNAL")], parseInt(process.argv[2]));

    console.log(node.getExpression());

    fs.writeFileSync("report/node.dot", node.getDot(), "utf-8");

    console.log(node.value({ x: 10 }));


}

//testaCombina();

testaProject();

//testaNodeExpression();

//testaIntegerInputLeaf();
//testaFloatConstantLeaf();
//testaIntegerConstantLeaf();
import 'source-map-support/register'
import * as fs from 'fs';
import * as stringify from "json-stable-stringify";
import { Utils } from "./josilts/utils";
import { Project, ExternalParameters } from './josilts/project';
import { Individual } from './josilts/individual';
import { GPNode } from './josilts/gp-node';
import { Support } from './josilts/support';



export function runProject1() {
    let externalParameters: ExternalParameters[] = [{ name: "d", type: "NUMBER" }, { name: "w", type: "NUMBER" }];


    let domingo = new GPNode("domingo", "FUNCTION", "NUMBER", "return externals['w']==1?1:i0", ["NUMBER"], 0);

    const sin = new GPNode("SIN", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0);
    const cos = new GPNode("SIN", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0);

    const nodes: GPNode[] = [...Support.getBasicMatematicalFunctions(), domingo, sin, cos];



    // console.log(ind.getInfo());
    // ind.updateFitness(targetValues);
    // console.log(ind.getInfo());
    // ind.rootExpression.updateH();
    // console.log(ind.getInfo());
    // ind.rootExpression.simplify(nodes);
    // ind.updateFitness(targetValues);
    // ind.rootExpression.updateH();
    // console.log(ind.getInfo());



    //    process.exit(0);



    let project1 = new Project("serra", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), nodes);
    project1.targetValues.push(...Support.createTargetValuesFromCSV("samples/serra.min.csv"));

    project1.evolveN(parseInt(process.argv[4]));
}


export function runProject2() {
    let externalParameters: ExternalParameters[] = [{ name: "x", type: "NUMBER" }];
    let project2 = new Project("polinomial", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), Support.getBasicMatematicalFunctions());
    project2.targetValues.push(...Support.createTargetValuesFromExpression(project2.externalParameters, "x*x*x-2*x*x+4*x-8"));


    project2.evolveN(parseInt(process.argv[4]));
}
function runProject21() {

    let p3: Project = Project.getInstance(JSON.parse(fs.readFileSync("bkp/polinomial_BKP_project.json").toString()));
    p3.evolveN(parseInt(process.argv[4]));
}


export function runProject3() {
    let externalParameters: ExternalParameters[] = [{ name: "dia", type: "NUMBER" }];

    let project3 = new Project("dolar", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...Support.getBasicMatematicalFunctions(), ...Support.getAdvancedMatematicalFunctions()]);
    Support.createTargetValuesFromCSV("samples/USD_BRL21.csv").forEach(vv => project3.targetValues.push({ ...vv, dia: vv.dia - 43125 }));

    project3.evolveN(parseInt(process.argv[4]));
}




export function runProject4() {
    let externalParameters: ExternalParameters[] = [{ name: "i", type: "NUMBER" }];
    let project1 = new Project("primos", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...Support.getBasicMatematicalFunctions(), ...Support.getAdvancedMatematicalFunctions()]);
    let n = fs.readFileSync("samples/primos.txt").toString().split("\r\n");
    let inc = 1;
    for (let i = 0; i < n.length; i += inc) {
        project1.targetValues.push({ i, output: n[i] });
        inc++;
    }
    project1.evolveN(parseInt(process.argv[4]));
}


export function exemploDidatio() {
    let externalParameters: ExternalParameters[] = [{ name: "x", type: "NUMBER" }];
    const sin = new GPNode("SIN", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0);
    const cos = new GPNode("COS", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0);
    let initialPopulation: Individual[] = [];
    if (fs.existsSync('bkp/didatico_BKP_best.json')) {
        let ind: Individual = Individual.getInstance(JSON.parse(fs.readFileSync('bkp/didatico_BKP_best.json').toString()));
        ind.rootExpression.deepSimplify();
        initialPopulation.push(ind);
    }

    let didatico = new Project("didatico", externalParameters, "NUMBER", 1000, 5, [...Support.getBasicMatematicalFunctions().filter(f => f.name != "mod" && f.name != "div"), sin, cos], initialPopulation);
    //didatico.targetValues.push(...Support.createTargetValuesFromExpression(externalParameters, "4*Math.cos(x+5)", -Math.PI, Math.PI, 0.1));
    didatico.targetValues.push(...Support.createTargetValuesFromCSV("samples/serra.min.csv"));
    didatico.population[0].fitness = -1;



    didatico.evolveWithBest();
    didatico.evolveN(20, 0.01);
    console.log(`s  ===>  ${didatico.population[0].id}  ${Support.getSimpleExpression(didatico.population[0].rootExpression)}`);

}

//exemploDidatio();

//let ind: Individual = Individual.getInstance(JSON.parse(fs.readFileSync("samples/serra_BKP_best.json", "utf8").toString()));
//console.log(ind.fitness);
//console.log(ind.rootExpression.h);
//let targetValues: any[] = [...Support.createTargetValuesFromCSV("samples/serra.min.csv")];


//console.log(Support.createTargetValuesFromExpression([{ name: "x", type: "NUMBER" }], "2*x"));



//let b = Support.evalExpressionWithParameters("4*Math.cos(x)", { x: 0 });
//console.log(b);

function test() {

    let c = new GPNode("", "CONSTANT", "NUMBER", "1");
    let c2 = new GPNode("", "CONSTANT", "NUMBER", "2");
    let c3 = new GPNode("", "CONSTANT", "NUMBER", "3");
    let c4 = new GPNode("", "CONSTANT", "NUMBER", "4");

    let e = new GPNode("x", "EXTERNAL", "NUMBER");

    let n = new GPNode("", "FUNCTION", "NUMBER", "return i0", ["NUMBER"], 0);
    let s = new GPNode("add", "FUNCTION", "NUMBER", "return i0+i1;", ["NUMBER", "NUMBER"], 0);
    let m = new GPNode("mull", "FUNCTION", "NUMBER", "return i0*i1;", ["NUMBER", "NUMBER"], 0);
    let s1 = s.createCopy();
    let s2 = s.createCopy();

    n.children.push(s);
    s.children.push(e, m);
    m.children.push(s1, s2);
    s1.children.push(c, c2);
    s2.children.push(c3, c4);

    console.log(`n ===> ${Support.getSimpleExpression(n)}`);

    GPNode.ALL.forEach(g => {
        console.log(g.id, g.label(), g.code, g.isPureConstant());
    });



    s.deepSimplify();

    GPNode.ALL.forEach(g => {
        console.log(g.id, g.label(), g.code, g.isPureConstant());
    });

    console.log(`n ===> ${Support.getSimpleExpression(n)}`);
}







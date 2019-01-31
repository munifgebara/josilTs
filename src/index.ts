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


export function runProject31() {
    let initialPopulation: Individual[] = [];
    Support.readIndividual(initialPopulation, 'bkp/dolar1_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar2_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar3_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar4_BKP_best.json');

    let csv = Support.createTargetValuesFromCSV("samples/USD_BRL21.csv");
    let externalParameters: ExternalParameters[] = Support.createExternalParametersFromTargetValues(csv);
    let project1 = new Project("dolar1", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...Support.getBasicMatematicalFunctions()], initialPopulation);
    Support.createTargetValuesFromCSV("samples/USD_BRL21.csv").forEach(vv => project1.targetValues.push({ ...vv, dia: vv.dia - 43125 }));
    project1.population[0].fitness = -1;
    //project1.evolveWithBest(4);
    project1.evolveN(parseInt(process.argv[4]));
}
export function runProject32() {
    const sin = new GPNode("sin", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0);
    const cos = new GPNode("cos", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0);


    let initialPopulation: Individual[] = [];
    Support.readIndividual(initialPopulation, 'bkp/dolar2_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar1_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar3_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar4_BKP_best.json');

    let csv = Support.createTargetValuesFromCSV("samples/USD_BRL21.csv");
    let externalParameters: ExternalParameters[] = Support.createExternalParametersFromTargetValues(csv);

    let project2 = new Project("dolar2", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...Support.getBasicMatematicalFunctions(), sin, cos], initialPopulation);
    Support.createTargetValuesFromCSV("samples/USD_BRL21.csv").forEach(vv => project2.targetValues.push({ ...vv, dia: vv.dia - 43125 }));
    project2.population[0].fitness = -1;
    //project2.evolveWithBest(4);
    project2.evolveN(parseInt(process.argv[4]));

}
export function runProject33() {
    let initialPopulation: Individual[] = [];
    Support.readIndividual(initialPopulation, 'bkp/dolar3_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar1_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar2_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar4_BKP_best.json');

    let csv = Support.createTargetValuesFromCSV("samples/USD_BRL21.csv");
    let externalParameters: ExternalParameters[] = Support.createExternalParametersFromTargetValues(csv);

    let project3 = new Project("dolar3", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...Support.getBasicMatematicalFunctions(), ...Support.getAdvancedMatematicalFunctions()], initialPopulation);
    Support.createTargetValuesFromCSV("samples/USD_BRL21.csv").forEach(vv => project3.targetValues.push({ ...vv, dia: vv.dia - 43125 }));
    project3.population[0].fitness = -1;
    //project3.evolveWithBest(4);
    project3.evolveN(parseInt(process.argv[4]));

}
export function runProject34() {
    let initialPopulation: Individual[] = [];
    Support.readIndividual(initialPopulation, 'bkp/dolar4_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar2_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar3_BKP_best.json');
    Support.readIndividual(initialPopulation, 'bkp/dolar1_BKP_best.json');

    let csv = Support.createTargetValuesFromCSV("samples/USD_BRL21.csv");
    let externalParameters: ExternalParameters[] = Support.createExternalParametersFromTargetValues(csv);


    let project4 = new Project("dolar4", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...Support.getBasicMatematicalFunctions(), ...Support.getRelationalFunctions()], initialPopulation);
    project4.population[0].fitness = -1;
    //project4.evolveWithBest(4);
    project4.evolveN(parseInt(process.argv[4]));
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
    //const sin = new GPNode("SIN", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0);
    //const cos = new GPNode("COS", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0);
    let initialPopulation: Individual[] = [];
    //Support.readIndividual(initialPopulation, 'bkp/didatico_BKP_best.json');

    let didatico = new Project("didatico", externalParameters, "NUMBER", 8, 3, [...Support.getBasicMatematicalFunctions()], initialPopulation);
    didatico.targetValues.push(...Support.createTargetValuesFromExpression(externalParameters, "4*Math.cos(x)", -Math.PI, Math.PI, 0.1));
    fs.writeFileSync(`pop/${didatico.title}_${didatico.generation}.dot`, didatico.getPopulationAsDot());
    didatico.evolve();
    fs.writeFileSync(`pop/${didatico.title}_${didatico.generation}.dot`, didatico.getPopulationAsDot());
    //    didatico.evolve();
    //    fs.writeFileSync(`pop/${didatico.title}_${didatico.generation}.dot`, didatico.getPopulationAsDot());


    //    didatico.evolveN(1, 0.01);
    //  console.log(`s  ===>  ${didatico.population[0].id}  ${Support.getSimpleExpression(didatico.population[0].rootExpression)}`);





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






function dolar(dia: number): number {
    return ((0.8145545593930124 + ((((dia == 0 ? 1 : ((dia == 0 ? 1 : 0.13422154488305327 / dia) + (0.9828376938267065 + ((((dia == 0 ? 1 : 0.044742675869120285 / dia) + 0.3781506311397911) + 0.07564166092334146) + dia))) / dia) + 0.5660886616524758) + 0.21942237255193286) + (((dia == 0 ? 1 : (dia == 0 ? 1 : ((((dia == 0 ? 1 : 0.15258120062253688 / dia) + 0.9040615196782311) + 0.8623428496068903) == 0 ? 1 : ((((((dia + 0.1733562586321844) + 0.22055015231039898) + (dia + ((((((dia == 0 ? 1 : 0.8055764435324262 / dia) + (dia == 0 ? 1 : 0.5235131328987639 / dia)) + 0.8144868699620966) == 0 ? 1 : (((dia + (0.9091329708461711 + (0.624083898189441 + ((dia == 0 ? 1 : ((((dia + 0.3274168501911656) + 0.9938275244744488) + (((dia + 0.5239564330304838) + 0.8826371865477824) + 0.9935586627518622)) / 0.7102673185264368) / dia) + 0.9420784888421831)))) + 0.8699997796278887) + 0.6914727987515659) / (((dia == 0 ? 1 : 0.8055764435324262 / dia) + (dia == 0 ? 1 : 0.5235131328987639 / dia)) + 0.8144868699620966)) + 0.2553712175020164) + 0.1264880687769654))) + 0.45300717950917213) + 0.6370594272942034) + 0.9271422923198092) / (((dia == 0 ? 1 : 0.15258120062253688 / dia) + 0.9040615196782311) + 0.8623428496068903)) / dia) / dia) + 0.41612083161345437) == 0 ? 1 : 0.684397582833745 / ((dia == 0 ? 1 : (dia == 0 ? 1 : ((((dia == 0 ? 1 : 0.15258120062253688 / dia) + 0.9040615196782311) + 0.8623428496068903) == 0 ? 1 : ((((((dia + 0.1733562586321844) + 0.22055015231039898) + (dia + ((((((dia == 0 ? 1 : 0.8055764435324262 / dia) + (dia == 0 ? 1 : 0.5235131328987639 / dia)) + 0.8144868699620966) == 0 ? 1 : (((dia + (0.9091329708461711 + (0.624083898189441 + (1 + 0.9420784888421831)))) + 0.8699997796278887) + 0.6914727987515659) / (((dia == 0 ? 1 : 0.8055764435324262 / dia) + (dia == 0 ? 1 : 0.5235131328987639 / dia)) + 0.8144868699620966)) + 0.2553712175020164) + 0.1264880687769654))) + 0.45300717950917213) + 0.6370594272942034) + 0.9271422923198092) / (((dia == 0 ? 1 : 0.15258120062253688 / dia) + 0.9040615196782311) + 0.8623428496068903)) / dia) / dia) + 0.41612083161345437)))));
}

console.log(dolar(1))
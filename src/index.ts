import * as fs from 'fs';
import * as stringify from "json-stable-stringify";
import { Utils } from "./josilts/utils";
import { Project } from './josilts/project';
import { Individual } from './josilts/individual';
import { GPNode } from './josilts/gp-node';



function runProject() {
    let project = new Project("f2", ["NUMBER", "NUMBER"], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    let serra = Project.readCSV("serra.csv");
    serra.forEach(s => {
        project.targetValues.push({ input: [s.d, s.w], output: s.p });
    })

    // Project.tenArray.forEach(x => {
    //     Project.tenArray.forEach(y => {
    //         project.targetValues.push({ input: [x, y], output: x * x + y * y + x * y + x + y + 13 });
    //     })
    // });


    let best = project.population[0];
    for (let ge = 0; ge <= parseInt(process.argv[4]); ge++) {
        process.stdout.write("                                                                                                                                Offspring " + ge + " " + project.avgFit + "\r");
        best = project.getBest();
        best.writeCSV(project.targetValues);
        project.evolve();
    }
    Project.writeSVGToDisk(`report/best.svg`, best.rootExpression.getDot());
    console.log(parseInt(process.argv[2]), parseInt(process.argv[3]), best.fitness);
    best.writeCSV(project.targetValues);
    console.log(best.rootExpression.getExpression());
}


runProject();
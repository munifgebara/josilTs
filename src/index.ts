import * as fs from 'fs';
import * as stringify from "json-stable-stringify";
import { Utils } from "./josilts/utils";
import { Project } from './josilts/project';
import { Individual } from './josilts/individual';
import { GPNode } from './josilts/gp-node';



function runProject1() {
    let project1 = new Project("serra", [{ name: "d", type: "NUMBER" }, { name: "w", type: "NUMBER" }], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    project1.insertTargetValuesFromCSV("serra.min.csv");

    project1.evolveN(parseInt(process.argv[4]));
}


function runProject2() {
    let project2 = new Project("polinomial", [{ name: "x", type: "NUMBER" }], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    project2.insertTargetValuesFromExpression("x*x*x-2*x*x+4*x-8");
    project2.evolveN(parseInt(process.argv[4]));
}


//runProject1();
runProject2();



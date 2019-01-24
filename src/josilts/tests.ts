import { GPNode } from './gp-node';
import { Project } from './project';
import { Utils } from './utils';


function testGPNode(){
    
    let dot = ` digraph GTest {`;
    
    let gpConstant=GPNode.getNumberConstantNode();
    dot+=gpConstant.getDotToCombine();

    let gpExternal=new GPNode("x","EXTERNAL","NUMBER");
    dot+=gpExternal.getDotToCombine();
    let gpExternal2=new GPNode("y","EXTERNAL","NUMBER");
    dot+=gpExternal2.getDotToCombine();

    let gpFunction=new GPNode("add","FUNCTION","NUMBER","return i0+i1;",["NUMBER","NUMBER"]);
    gpFunction.children=[gpExternal.createCopy(),gpConstant.createCopy()];
    dot+=gpFunction.getDotToCombine();

    let gpFunction2=new GPNode("","FUNCTION","NUMBER","return i0;",["NUMBER"]);
    gpFunction2.initChildren([gpExternal,gpExternal2],3);

    let gpFunction3=new GPNode("","FUNCTION","NUMBER","return i0;",["NUMBER"]);
    gpFunction3.initChildren([gpExternal,gpExternal2],3);

    console.log(gpFunction.value({x:3}));
    console.log(gpFunction2.value({x:3,y:2}));
    console.log(gpFunction3.value({x:3,y:2}));
    dot+=gpFunction2.getDotToCombine();
    dot+=gpFunction3.getDotToCombine();

    let {i1:gpFunction4,i2:gpFunction5}=GPNode.combine(gpFunction2,gpFunction3);

    
    dot+=gpFunction4.getDotToCombine();
    
    
    dot+=gpFunction5.getDotToCombine();
    

    
    
    
    dot+="}";



    
    


    Project.writeSVGToDisk(`report/number.svg`, dot);


}

function testTypes(){
    let gpExternal=new GPNode("x","EXTERNAL","NUMBER");
    let gpExternal2=new GPNode("b","EXTERNAL","BOOLEAN");
    let gpFunction2=new GPNode("","FUNCTION","NUMBER","return i0;",["NUMBER"]);
    gpFunction2.initChildren([gpExternal,gpExternal2],4);
    Project.writeSVGToDisk(`report/types.svg`, gpFunction2.getDot());
    console.log(gpFunction2.value({x:1,b:false}));
    console.log(gpFunction2.value({x:1,b:true}));

}
testTypes();

testGPNode();
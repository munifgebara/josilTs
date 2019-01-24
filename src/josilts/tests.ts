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
    let gpExternalb=new GPNode("b","EXTERNAL","BOOLEAN");
    dot+=gpExternal2.getDotToCombine();

    let gpFunction=new GPNode("add","FUNCTION","NUMBER","return i0+i1;",["NUMBER","NUMBER"]);
    gpFunction.children=[gpExternal.createCopy(),gpConstant.createCopy()];
    console.log("H1:"+gpFunction.height());
    dot+=gpFunction.getDotToCombine();

    let gpFunction2=new GPNode("","FUNCTION","NUMBER","return i0;",["NUMBER"]);
    gpFunction2.initChildren([gpExternal,gpExternal2,gpExternalb],2);
    console.log("H2:"+gpFunction2.height());

    let gpFunction3=new GPNode("","FUNCTION","NUMBER","return i0;",["NUMBER"]);
    gpFunction3.initChildren([gpExternal,gpExternal2,gpExternalb],3);
    console.log("H3:"+gpFunction3.height());

    console.log(gpFunction.value({x:3}));
    console.log(gpFunction2.value({x:3,y:2}));
    console.log(gpFunction3.value({x:3,y:2}));
    dot+=gpFunction2.getDotToCombine();
    dot+=gpFunction3.getDotToCombine();

    let {i1:gpFunction4,i2:gpFunction5}=GPNode.combine(gpFunction2,gpFunction3);
    console.log("H4:"+gpFunction4.height());
    console.log("H5:"+gpFunction5.height());

    
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
    console.log("H:"+gpFunction2.height());

}
testTypes();

testGPNode();
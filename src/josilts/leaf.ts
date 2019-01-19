import { Type, TreeNode } from "./tree-node";


export type Behavior = "INPUT" | "CONSTANT";

export abstract class Leaf extends TreeNode {

    constructor(name: string, public type: Type, protected behavior: Behavior) {
        super(name, type);
    }

    public abstract newIntance(): Leaf;

}
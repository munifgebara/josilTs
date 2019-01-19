

export type Type = "INTEGER" | "FLOAT" | "BOOLEAN" | "STRING";

export abstract class TreeNode {

    public static ID = 0;

    public id = 0;

    public desc: string;

    constructor(public name: string, public type: Type) {
        this.id = ++TreeNode.ID;
        this.desc = "TreeNode";
    }

    public abstract getValue(input: any): any;




}
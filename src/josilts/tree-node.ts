

export type Type = "INTEGER" | "FLOAT" | "BOOLEAN" | "STRING";

export abstract class TreeNode {

    constructor(public name: string, public type: Type) {

    }

    public abstract getValue(input: any): any;




}
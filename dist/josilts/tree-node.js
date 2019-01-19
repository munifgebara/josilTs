"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TreeNode {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.id = 0;
        this.id = ++TreeNode.ID;
        this.desc = "TreeNode";
    }
}
TreeNode.ID = 0;
exports.TreeNode = TreeNode;
//# sourceMappingURL=tree-node.js.map
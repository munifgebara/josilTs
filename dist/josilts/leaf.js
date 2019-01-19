"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tree_node_1 = require("./tree-node");
class Leaf extends tree_node_1.TreeNode {
    constructor(name, type, behavior) {
        super(name, type);
        this.type = type;
        this.behavior = behavior;
    }
}
exports.Leaf = Leaf;
//# sourceMappingURL=leaf.js.map
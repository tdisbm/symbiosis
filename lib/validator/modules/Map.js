var constraints = require("../Constraints.js");
var template = require("../templates/map.template.json");

var Map = function(map) {
    this.template = template;
    this.constraints = new constraints();
    this.map = map;
};

/**
 * validate map
 *
 * @returns {boolean} true if map is according to template
 */
Map.prototype.validate  = function() {
    try {
        this.constraints.flush();
        this.validateNode(this.template, this.map);
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }

    return true;
};

/**
 *
 * @param template
 * @param node
 */
Map.prototype.validateNode = function(template, node) {
    for (var i in template) {
        if (!template.hasOwnProperty(i)) {
            continue;
        }

        if (template[i].hasOwnProperty("validators")) {
            this.validateConstraints(template[i]["validators"], node[i], i);
        }

        if (template[i].hasOwnProperty("items")) {
            for (var j in node[i]) {
                if (!node[i].hasOwnProperty(j)) {
                    continue;
                }

                this.validateNode(template[i]["items"], node[i][j]);
            }
            delete template[i]["items"];
        }

        if (typeof template[i]  === "object" &&
            typeof node[i]      === "object" &&
            Object.keys(template[i]).length  &&
            i !== "validators"
        ) {
            this.validateNode(template[i], node[i]);
        }
    }
};

/**
 *
 * @param constraints object
 * @param node object|string|number
 * @param nodeName string
 */
Map.prototype.validateConstraints = function(constraints, node, nodeName) {
    if (typeof constraints !== "object") {
        throw new Error("Invalid Constraints at node " + nodeName);
    }

    for (var validator in constraints) {
        if (!constraints.hasOwnProperty(validator)) {
            continue;
        }

        var feedback = this.constraints.validate(node, nodeName, validator, constraints[validator]);

        if (typeof feedback === "object") {
            if(feedback.hasOwnProperty("template") && feedback.hasOwnProperty("node")) {
                this.validateNode(feedback["template"], feedback["node"])
            }
        }
    }
};

/**
 *
 * @type {string}
 */
Map.prototype.name = "map";


module.exports = Map;

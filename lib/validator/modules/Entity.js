var validators = require("../Validators.js");
var helpers = require("../../helper/loader.js");

var Entity = function(map) {
    this.validators = new validators();
    this.required = {
        "properties" : ["events"]
    };
    this.dependencies = ["io"];
    this.helpers = helpers;
    this.map = map;
};

Entity.prototype.validate = function() {
    var nodes = this.map.nodes;

    this.validators.flush();
    try {
        for (var node in nodes) {
            if (!nodes.hasOwnProperty(node)) {
                continue;
            }

            var object = require(this.helpers["file"].getFullFilePath(nodes[node].entity));
            var entity = new object(eval(this.dependencies.join(",")));

            if (nodes[node].hasOwnProperty("properties")) {
                nodes[node].properties.concat(this.required.properties);
            } else {
                nodes[node].properties = this.required.properties
            }

            this.validators.validate(object, this.dependencies, "has-dependencies");
            this.validators.validate(entity, nodes[node].properties, "has-properties");
        }
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

Entity.prototype.name = "entity";

module.exports = Entity;
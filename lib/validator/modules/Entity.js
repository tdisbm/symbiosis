var validators = require("../Validators.js");
var helpers = require("../../helper/loader.js");

var Entity = function(map) {
    this.validators = new validators();
    this.dependencies = ["io"];
    this.helpers = helpers;
    this.map = map;
};

Entity.prototype.validate = function() {
    var entity;
    var path;
    var nodes = this.map.nodes;

    this.validators.flush();
    try {
        for (var node in nodes) {
            if (!nodes.hasOwnProperty(node)) {
                continue;
            }

            if (!nodes[node].hasOwnProperty("properties") && !nodes[node].hasOwnProperty("dependencies")) {
                continue;
            }

            path = this.helpers["file"].getFullFilePath(nodes[node].entity);
            var object = require(path);

            this.validators.validate(object, this.dependencies, "has-dependencies");

            entity = new object(eval(this.dependencies.join(",")));

            if (nodes[node].hasOwnProperty("properties")) {
                this.validators.validate(entity, nodes[node].properties, "has-properties");
            }
        }
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

Entity.prototype.name = "entity";

module.exports = Entity;
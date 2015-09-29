var Constraints = function(){
    var uniqueValues = {};

    this.validators = {
        "required"    : function(node, nodeName, expected) {
            if (expected === false) {
                return true;
            }

            if (typeof node === "undefined") {
                throw new Error("'" + nodeName + "' is required!");
            }

            return true;
        },
        "is-file"     : function(node, nodeName) {

        },
        "not-null"    : function(node, nodeName) {
            if (node === null) {
                throw new Error("'" + nodeName + "' is null")
            }

            return true;
        },
        "not-empty"   : function(node, nodeName) {
            if (node.length === 0) {
                throw new Error("'" + nodeName + "' is empty")
            }

            return true;
        },
        "file-path"   : function(node, nodeName) {
            var path = require('path');
            var fs = require('fs');
            var filePath = path.dirname(require.main.filename) + node;

            try {
                fs.statSync(filePath);
            } catch (err) {
                throw new Error("File " + filePath + " not exist in node " + nodeName);
            }
        },
        "unique"      : function(node, nodeName, expected) {
            var property;

            if (typeof expected !== "boolean" && !expected.hasOwnProperty("key")) {
                throw new Error("Undefined parameters in " + nodeName);
            }

            if (typeof expected === "boolean" && expected === false) {
                return true;
            }

            if (expected.hasOwnProperty("key")) {
                property = expected["key"];
            } else {
                property = nodeName;
            }
            uniqueValues[property] = uniqueValues[property] || [];

            if (typeof node === "object" && node.constructor === Array) {
                if ((new Set(node)).size !== node.length) {
                    throw new Error ("Node " + nodeName + " has duplicates");
                }
            }

            if (uniqueValues[property].indexOf(node) !== -1) {
                throw new Error("Node " + property + " must be unique");
            }

            uniqueValues[property].push(node);

            return true;
        },
        "switch"      : function(node, nodeName, expected) {
            for (var property in expected) {
                if (!expected.hasOwnProperty(property)) {
                    continue;
                }

                if (!node.hasOwnProperty(property)) {
                    throw new Error("Can't switch property '" + property + "' of node '" + nodeName + "'");
                }

                for (var switch_case in expected[property]) {
                    if (!expected[property].hasOwnProperty(switch_case)) {
                        continue;
                    }

                    if (switch_case === node[property]){
                        return {
                            "template" : expected[property][switch_case],
                            "node"     : node
                        }
                    }
                }
            }

            return true;
        },
        "constructor" : function(node, nodeName, expected) {
            if (typeof node === "undefined") {
                return true;
            }

            if (node.constructor !== eval(expected)) {
                throw new Error("Constructor of '" + nodeName + "' is not " + expected)
            }

            return true;
        },
        "min-length"  : function(node, nodeName, expected) {
            if (node.length < expected) {
                throw new Error("Length of '" + nodeName + "' is under " + expected)
            }

            return true;
        },
        "max-length"  : function(node, nodeName, expected) {
            if (node.length > expected) {
                throw new Error("Length of '" + nodeName + "' is greater than " + expected)
            }

            return true;
        },
        "admit"       : function(node, nodeName, expected) {
            if (expected.indexOf(node) === -1) {
                throw new Error(
                    "Property " + nodeName + " admit only " + expected.toString() + ", " + node + " given!"
                )
            }
        }
    };

    this.flush = function() {
        uniqueValues = {};
    }
};

Constraints.prototype.validate = function(node, nodeName, validator, expected) {
    if (typeof this.validators[validator] === "undefined") {
        throw new Error("Map Constraints Error: Constraint '" + validator + "' is not defined!");
    }

    try {
        return this.validators[validator](node, nodeName, expected);
    } catch (err) {
        throw new Error("Map Constraints Error: " + err.message + "\nNode: " + nodeName + "\nValidator: " + validator + "\nExpects: " + expected);
    }
};




module.exports = Constraints;

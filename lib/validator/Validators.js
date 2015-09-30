var Validators = function(){
    this.validators = {
        "has-properties" : function(entity, properties) {
            if (properties.constructor !== Array) {
                throw new Error("Properties must have Array constructor");
            }

            properties.forEach(function(property) {
                if (!entity.hasOwnProperty(property)) {
                    throw new Error("Entity didn't have property " + property);
                }
            });
        },

        "has-dependencies" : function(entity, dependencies) {
            var args = entity.toString()
                .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
                .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
                .split(",");
            if (args.sort().join(",") !== dependencies.sort().join(",")) {
                throw new Error("Invalid dependencies " + args + ", allowed dependencies: " + dependencies.join(","));
            }
        }
    };

    this.flush = function() {}
};

Validators.prototype.validate = function(entity, template, validator) {
    if (typeof this.validators[validator] === "undefined") {
        throw new Error("Entity Constraints Error: Constraint '" + validator + "' is not defined!");
    }

    try {
        return this.validators[validator](entity, template);
    } catch (err) {
        throw new Error("Entity Constraints Error: " + err.message + "\nNode: " + template + "\nValidator: " + validator);
    }
};


module.exports = Validators;

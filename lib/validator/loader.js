var loader = function(map) {
    if (typeof map === "undefined") {
        throw Error("Map is undefined!");
    }

    var normalizedPath = require("path").join(__dirname, "modules");
    var validators = {};

    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        var validator = require(normalizedPath + "/" + file);
        validators[validator.prototype.name] = new validator(map);
    });

    return validators;
};

module.exports = loader;
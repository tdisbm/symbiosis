var loader = function() {
    var normalizedPath = require("path").join(__dirname, "modules");
    var helpers = {};

    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        var helper = require(normalizedPath + "/" + file);
        helpers[helper.prototype.name] = new helper();
    });

    return helpers;
};


module.exports = loader();
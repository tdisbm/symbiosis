var loader = function() {
    var normalizedPath = require("path").join(__dirname, "modules");
    var utils = {};

    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        var util = require(normalizedPath + "/" + file);
        utils[util.prototype.name] = util;
    });

    return utils;
};


module.exports = loader();
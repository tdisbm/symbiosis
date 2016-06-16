var loader = function() {
    var normalizedPath = require("path").join(__dirname, "modules");
    var storages = {};

    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        var storage = require(normalizedPath + "/" + file);
        storages[storage.prototype.name] = storage;
    });

    return storages;
};


module.exports = loader();
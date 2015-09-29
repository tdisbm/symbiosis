var FileHelper = function() {
    this.path = require('path');
    this.fs = require('fs');
};

FileHelper.prototype.getFullFilePath = function(path){
    var filePath = this.path.dirname(require.main.filename) + path;

    try {
        this.fs.statSync(filePath);
        return filePath;
    } catch (err) {
        throw new Error("File " + filePath + " not exist");
    }
};

FileHelper.prototype.name = "file";

module.exports = FileHelper;
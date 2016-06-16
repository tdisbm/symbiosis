var Path = require('path');
var Fs = require('fs');


/**
 * @constructor
 */
var FilePathResolver = function() 
{
    
};


/**
 * @type {{
 *  getFullPath: FilePathResolver.getFullPath
 * }}
 */
FilePathResolver.prototype = 
{
    /**
     * get full file path
     * 
     * @param path
     * @returns {string}
     */
    getFullPath : function(path) {
        var filePath = Path.dirname(require.main.filename) + '/' + path;

        try {
            Fs.statSync(filePath);
            return filePath;
        } catch (err) {
            throw new Error("File " + filePath + " not exist");
        }
    }
};


/**
 * @type {FilePathResolver}
 */
module.exports = new FilePathResolver();
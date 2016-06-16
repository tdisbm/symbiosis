var FilePathResolver = require('../../../Services/File/FilePathResolver.js');
var HandshakeMapperInterface = require('./Components/HandshakeMapperInterface.js');
var Wrapper = require('../../Util/Object/Wrapper.js');
var ArrayCollection = require('../../Util/ArrayCollection.js');


/**
 *
 * @constructor
 */
var HandshakeMapperResolver = function()
{
    this.arrayCollection = new ArrayCollection();
};


HandshakeMapperResolver.prototype =
{
    /**
     * mapper {HandshakeMapperInterface}
     * @returns {*}
     */
    resolve : function(mapper)
    {
        var args = Array.prototype.slice.call(arguments);
        var object = require(FilePathResolver.getFullPath(mapper.class));
        
        args.shift();
        
        object.prototype = Object.assign(HandshakeMapperInterface.prototype, object.prototype);
        object = Wrapper.create(object, args);
        
        this.arrayCollection.addItem(object);
        
        return object;
    },
    
    getCollection : function()
    {
        return this.arrayCollection;
    }
};


/**
 * @type {HandshakeMapperResolver}
 */
module.exports = new HandshakeMapperResolver();

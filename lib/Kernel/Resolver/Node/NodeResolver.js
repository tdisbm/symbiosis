var AbstractNode = require('./Components/AbstractNode.js');
var Collection = require('../../Util/ObjectCollection.js');
var FilePathResolver = require('../../../Services/File/FilePathResolver.js');
var Wrapper = require('../../Util/Object/Wrapper.js');


/**
 * @constructor
 */
var NodeResolver = function()
{
    this.collection = new Collection();
};


/**
 * @type {{
 *  resolve: NodeResolver.resolve,
 *  linkNodes: NodeResolver.linkNodes,
 *  getCollection: NodeResolver.getCollection,
 *  nodeWrapper: NodeResolver.nodeWrapper
 * }}
 */
NodeResolver.prototype = 
{
    /**
     * resolve node by configuration
     *
     * @param node
     * @param io
     */
    resolve : function(node, io)
    {
        var args = Array.prototype.slice.call(arguments);
        var object = require(FilePathResolver.getFullPath(node.class));
        
        args.shift();
        
        object.prototype = Object.assign(AbstractNode.prototype, object.prototype);
        object.prototype._config = node;
        object.prototype._io = io;
        
        object = Wrapper.create(object, args);
        object.setConfig(node)
            .setIo(io)
            .setCollection(this.collection)
            .init();

        this.collection.addItem(node.name, object);
        
        return object;
    },

    /**
     * return collection of nodes
     *
     * @returns {Collection}
     */
    getCollection : function()
    {
        return this.collection;
    }
};


/**
 * @type {NodeResolver}
 */
module.exports = new NodeResolver();
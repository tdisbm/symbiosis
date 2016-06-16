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
     */
    resolve : function(node)
    {
        var args = Array.prototype.slice.call(arguments);
        var object = require(FilePathResolver.getFullPath(node.class));

        args.shift();

        object.prototype = Object.assign(AbstractNode.prototype, object.prototype);
        object = Wrapper.create(object, args).setConfig(node);

        this.collection.addItem(node.name, object);
        
        return object;
    },

    /**
     * @returns {NodeResolver}
     */
    linkNodes : function()
    {
        var $this = this;
        
        this.collection.iterate(function(node) {
            node.setCollection($this.getCollection());
        });
        
        return this;
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
var AbstractNode = function (config)
{    
    config = config || null;
    
    this._config = config;
    this._io = null;
    this._collection = null;
};


/**
 * @type {{
 *  setIo: AbstractNode.setIo, 
 *  setCollection: AbstractNode.setCollection, 
 *  getCollection: AbstractNode.getCollection, 
 *  getNode: AbstractNode.getNode
 * }}
 */
AbstractNode.prototype =
{
    /**
     * set io environment
     * 
     * @param io
     */
    setIo : function(io)
    {
        this._io = io;
    },

    /**
     * set collection of nodes
     * 
     * @param collection
     * @returns {AbstractNode}
     */
    setCollection : function(collection) 
    {
        this._collection = collection;
        
        return this;
    },

    /**
     * get node collection
     * 
     * @returns {null|*}
     */
    getCollection : function()
    {
        return this._collection;
    },

    /**
     * get specific node from collection
     * 
     * @param name
     * @returns {*}
     */
    getNode : function(name)
    {
        if (null === this._collection) {
            throw new Error('Collection is null');
        }
        
        return this._collection.get(name);
    },
    
    getNamespace : function()
    {
        var namespace = '/';

        if (typeof this._config !== 'undefined') {
            if (typeof this._config.namespace !== 'undefined' && String.isString(this._config.namespace)) {
                namespace = this._config.namespace;
            }
        }

        return namespace;
    },
    
    setConfig : function(config)
    {
        this._config = config;
        
        return this;
    },
    
    getConfig : function()
    {
        if (null === this._config || typeof this._config === 'undefined') {
            throw new Error('Node is not configured!');
        }
        
        return this._config;
    }
};


module.exports = AbstractNode;
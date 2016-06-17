var HandshakeListener = require('../../../Listener/HandshakeListener.js');


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
        
        return this;
    },

    /**
     * @param config
     * @returns {AbstractNode}
     */
    setConfig : function(config)
    {
        this._config = config;

        return this;
    },
    
    getIdentifier : function()
    {
        var parameters = this.getConfig().handshake.parameters;
        
        for (var i = 0, n = parameters.length; i < n; i++) {
            if (!parameters[i].hasOwnProperty('options')) {
                continue;
            }
            
            if (parameters[i].options.indexOf('identifier') !== -1) {
                return parameters[i];
            }
        }
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

    /**
     * @returns {string}
     */
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

    /**
     * @returns {*|null}
     */
    getConfig : function()
    {
        if (null === this._config || typeof this._config === 'undefined') {
            throw new Error('Node is not configured!');
        }
        
        return this._config;
    },

    /**
     * @param event
     * @param fn
     */
    on : function(event, fn)
    {
        var identifier = this.getIdentifier();
        var config = this.getConfig();
        
        this._io.of(this.getNamespace()).on(event, function(socket) {
            var query = socket.handshake.query;
            
            if (query[identifier.name] != config.name) {
                return;
            }
            
            if (typeof fn === 'function') {
                fn(socket);
            }
        });
    }
};


module.exports = AbstractNode;
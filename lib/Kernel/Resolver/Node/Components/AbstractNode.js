var HandshakeListener = require('../../../Listener/HandshakeListener.js');
var ArrayCollection = require('../../../Util/ArrayCollection.js');
var ObjectCollection = require('../../../Util/ObjectCollection.js');


var AbstractNode = function (config)
{    
    config = config || null;
    
    this._config = config;
    this._io = null;
    this._collection = null;
    this._sockets = new ArrayCollection();
    this._events = new ObjectCollection();
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
    
    init : function()
    {
        var identifier = this.getIdentifier();
        var config = this.getConfig();
        var $this = this;
        
        if (typeof this._sockets === "undefined") {
            this._sockets = new ArrayCollection();
        }

        this._io.of(this.getNamespace()).on("connect", function(socket) {
            var query = socket.handshake.query;

            if (query[identifier.name] != config.name) {
                return;
            }

            $this._events.iterate(function(fn, event){
                socket.on(event, function(data){
                    fn(socket, data);
                });
            })
        });
    },

    io : function() {
        return this._io.of(this.getNamespace());
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
        
        return this._collection.getItem(name);
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
        if (typeof this._events === "undefined") {
            this._events = new ObjectCollection();
        }

        if (typeof fn === 'function') {
            this._events.addItem(event, fn);
        }
        
        return this;
    }
};


module.exports = AbstractNode;
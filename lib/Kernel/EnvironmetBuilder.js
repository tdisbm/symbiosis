var NodeResolver = require('./Resolver/Node/NodeResolver.js');
var HandshakeResolver = require('./Resolver/Handshake/HandshakeResolver.js');
var HandshakeListener = require('./Listener/HandshakeListener.js');
var ObjectCollection = require('./Util/ObjectCollection.js');

/**
 * @constructor
 */
var EnvironmentBuilder = function()
{
    /** @var {Symbiosis} */
    this._environement = null;
    this._compiledSet = new ObjectCollection();
};


EnvironmentBuilder.prototype =
{
    build : function()
    {
        this._validateEnvironment(this._environement);

        this._handshakeListener = new HandshakeListener(
            this._environement.getIo()
        );
        
        this._resolveNodes();
        this._resolveMappers();
        
        this._compiledSet
            .addItem('environment', this._environement)
            .addItem('nodeResolver', NodeResolver)
            .addItem('handshakeResolver', HandshakeResolver)
        .addItem('handshakeListener', this._handshakeListener);
        
        return this._compiledSet;
    },

    /**
     * @param environment {Symbiosis}
     */
    setEnvironment : function (environment)
    {
        this._environement = environment;
    },
    
    getCompiledSet : function () {
        return this._compiledSet;
    },

    /**
     * @param environment {Symbiosis}
     * @private
     */
    _validateEnvironment : function(environment)
    {
        if (null === this._environement) {
            this._throwInvalidEnvironmentError();
        }
        
        if (
            typeof environment.getIo !== 'function' ||
            typeof environment.getMap !== 'function'
        ) {
            this._throwInvalidEnvironmentError();
        }
    },

    /**
     * @private
     */
    _resolveNodes : function()
    {
        var $this = this;
        var nodes = this._environement.getMap().getElements().nodes;

        for (var i = 0, n = nodes.length; i < n; i ++) {
            NodeResolver.resolve(nodes[i], this._environement.getIo())
        }

        NodeResolver.getCollection().iterate(function(node) {
            $this._handshakeListener.listen(node);
        });
    },

    /**
     * @private
     */
    _resolveMappers : function()
    {
        var nodes = this._environement.getMap().getElements().nodes;

        for (var i = 0, n = nodes.length; i < n; i++) {
            HandshakeResolver.resolve(nodes[i]);
        }

        this._handshakeListener.setHandshakeResolver(HandshakeResolver);
    },

    /**
     * @private
     */
    _throwInvalidEnvironmentError : function()
    {
        throw new Error('Invalid Symbiosis environment provided');
    }
};


module.exports = new EnvironmentBuilder();
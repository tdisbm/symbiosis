var ObjectCollection = require('../Util/ObjectCollection.js');

var HandshakeListener = function(io)
{
    this._io = io;
    this._handshakeResolver = null;
    this._nodes = new ObjectCollection();
    
    this._init();
};


HandshakeListener.prototype =
{
    listen : function()
    {
        var $this = this;
        var valid = false;
        var node = null;
        
        this._io.use(function(socket, next){
            for (node in $this._nodes.getItems()) {
                if (!$this._nodes.items.hasOwnProperty(node)) {
                    continue;
                }

                valid = $this._validate($this._nodes.getItem(node), socket);
                
                if (valid) {
                    $this._mapHandshakeQuery($this._nodes.getItem(node), socket);
                    break;
                }
            }
            
            if (valid) {
                next();
            }
        });
    },

    /**
     * @param handshakeResolver {HandshakeResolver}
     */
    setHandshakeResolver : function(handshakeResolver)
    {
        this._handshakeResolver = handshakeResolver;
    },

    /**
     * @param node {AbstractNode}
     * @param socket
     * @private
     */
    _validate : function(node, socket) {        
        var config = node.getConfig();
        var query = socket.handshake.query;
        var parameters = config.handshake.parameters;
        var valid = false;

        for (var i = 0, n = parameters.length; i < n; i++) {
            if (typeof parameters[i].options === 'undefined') {
                continue;
            }

            if (parameters[i].options.indexOf('required') !== -1 && typeof query[parameters[i].name] === 'undefined') {
                return false;
            }
            
            if (parameters[i].options.indexOf("identifier") !== -1 && query[parameters[i].name] === config.name) {
                valid = true;
            }
        }
        
        return valid;
    },

    /**
     * @private
     */
    _init : function()
    {
    },

    _mapHandshakeQuery : function(node, socket)
    {
        if (null == this._handshakeResolver) {
            return false;
        }

        if (typeof this._handshakeResolver.getCollection !== 'function') {
            return false;
        }

        try {
            this._handshakeResolver
                .getCollection()
                .getItem(node.getConfig().name)
                .iterate(
            function(mapper){
                mapper.map(socket.handshake.query);
            })
        } catch (e) {
            return false;
        }
    },
    
    setNodes : function(nodes) 
    {
        this._nodes = nodes;
    }
};


module.exports = HandshakeListener;
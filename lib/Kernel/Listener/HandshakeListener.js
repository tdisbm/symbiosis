var HandshakeListener = function(io)
{
    this._io = io;
    this._identified = false;
    this._handshakeResolver = null;
    
    this._init();
};


HandshakeListener.prototype =
{
    /**
     * @param node {AbstractNode}
     */
    listen : function(node)
    {
        var namespace = node.getNamespace();
        var $this = this;

        if (typeof namespace !== 'string') {
            throw new Error('AbstractNode.getNamespace() method should return string value');
        }
        
        this._io.of(namespace).use(function(socket, next){
            $this._validate(node, socket) 
                ? next() 
                : socket.disconnect();
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

        for (var i = 0, n = parameters.length; i < n; i++) {
            if (typeof parameters[i].options === 'undefined') {
                continue;
            }
            
            if (parameters[i].options.indexOf("identifier") !== -1 && query[parameters[i].name] === config.name) {
                if (parameters[i].options.indexOf('required') !== -1 && typeof query[parameters[i].name] === 'undefined') {
                    this._identified = true;
                }

                this._mapHandshakeQuery(node, socket);
                return true;
            }
        }
        
        return true;
    },

    /**
     * @private
     */
    _init : function()
    {
        this._appendEvents();
    },

    /**
     * @returns {HandshakeListener}
     * @private
     */
    _appendEvents : function()
    {
        var $this = this;
        
        this._io.on('connection', function(socket) {            
            if (false === $this._identified) {
                socket.disconnect();
            }
            
            $this._identified = false;
        });
        
        return this;
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
    }
};


module.exports = HandshakeListener;
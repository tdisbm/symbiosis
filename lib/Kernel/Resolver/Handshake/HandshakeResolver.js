var HandshakeMapperResolver = require('./HandshakeMapperResolver.js');
var ObjectCollection = require('../../Util/ObjectCollection.js');


var HandshakeResolver = function()
{
    this.collection = new ObjectCollection();
};


HandshakeResolver.prototype = 
{
    resolve : function(node)
    {        
        var mappers = node.handshake.mappers;

        if (typeof mappers !== 'undefined') {
            for (var i = 0, n = mappers.length; i < n; i++) {
                HandshakeMapperResolver.resolve(mappers[i], node);
            }
        }
        
        var collection = HandshakeMapperResolver.getCollection().clone();

        HandshakeMapperResolver.getCollection().clear();
        
        this.collection.addItem(node.name, collection);
    },
    
    getCollection : function()
    {
        return this.collection;
    }
};


module.exports = new HandshakeResolver();
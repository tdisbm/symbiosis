var EnvironmentBuilder = require('./EnvironmetBuilder.js');
var Wrapper = require('./Util/Object/Wrapper.js');
var Map = require('./Map/Map.js');

var Symbiosis = function(mapPath)
{
    this._map = new Map(mapPath);
    this._io = require('socket.io')();

    this._init();
};


Symbiosis.prototype =
{
    getIo : function()
    {
        return this._io;
    },
    
    getMap : function()
    {
        return this._map;
    },
    
    _init : function()
    {
        EnvironmentBuilder.setEnvironment(this);
        EnvironmentBuilder.build();
    }
};


module.exports = function () {
    return Wrapper.create(Symbiosis, arguments);
};
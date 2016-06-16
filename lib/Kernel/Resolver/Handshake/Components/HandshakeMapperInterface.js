/**
 * @constructor
 */
var NodeMapperInterface = function()
{

};


/**
 * @type {{map: NodeMapperInterface.map}}
 */
NodeMapperInterface.prototype =
{
    /**
     * function to map parameters
     */
    map : function()
    {
        this._throwInterfaceError();
    },
    
    _throwInterfaceError : function()
    {
        throw new Error('Map method should be implemented');
    }
};


/**
 * @type {NodeMapperInterface}
 */
module.exports = NodeMapperInterface;
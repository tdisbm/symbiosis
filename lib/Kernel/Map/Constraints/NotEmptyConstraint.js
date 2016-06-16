var Util = require("util");
var ConstraintInterface = require("./ConstraintInterface.js");


var NotEmptyConstraint = function()
{
    NotEmptyConstraint.super_.apply(this, arguments);
};


Util.inherits(NotEmptyConstraint, ConstraintInterface);


NotEmptyConstraint.prototype =
{
    validate : function(node, nodeName) 
    {
        if (node.length === 0) {
            throw new Error("'" + nodeName + "' is empty")
        }

        return true;
    }
};


module.exports = NotEmptyConstraint;
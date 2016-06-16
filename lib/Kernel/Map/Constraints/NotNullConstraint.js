var Util = require("util");
var ConstraintInterface = require("./ConstraintInterface.js");


var NotNullConstraint = function()
{
    NotNullConstraint.super_.apply(this, arguments);
};


Util.inherits(NotNullConstraint, ConstraintInterface);


NotNullConstraint.prototype =
{
    validate : function(node, nodeName) 
    {
        if (node === null) {
            throw new Error("'" + nodeName + "' is null")
        }

        return true;
    }
};


module.exports = NotNullConstraint;
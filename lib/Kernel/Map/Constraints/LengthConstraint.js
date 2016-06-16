var Util = require("util");
var ConstraintInterface = require("./ConstraintInterface.js");


var LengthConstraint = function()
{
    LengthConstraint.super_.apply(this, arguments);
};


Util.inherits(LengthConstraint, ConstraintInterface);


LengthConstraint.prototype =
{
    validate : function(node, nodeName, expected) 
    {
        if (node.length < expected) {
            throw new Error("Length of '" + nodeName + "' is under " + expected)
        }

        return true;
    }
};


module.exports = LengthConstraint;
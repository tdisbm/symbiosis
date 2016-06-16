var Util = require("util");
var ConstraintInterface = require("./ConstraintInterface.js");


var MaxLengthConstraint = function()
{
    MaxLengthConstraint.super_.apply(this, arguments);
};


Util.inherits(MaxLengthConstraint, ConstraintInterface);


MaxLengthConstraint.prototype =
{
    validate : function(node, nodeName, expected) 
    {
        if (node.length > expected) {
            throw new Error("Length of '" + nodeName + "' is greater than " + expected)
        }

        return true;
    }
};


module.exports = MaxLengthConstraint;
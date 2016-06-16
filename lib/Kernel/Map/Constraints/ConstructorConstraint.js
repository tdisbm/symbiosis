var Util = require("util");
var ConstraintInterface = require("./ConstraintInterface.js");


var ConstructorConstraint = function()
{
    ConstructorConstraint.super_.apply(this, arguments);
};


Util.inherits(ConstructorConstraint, ConstraintInterface);


ConstructorConstraint.prototype =
{
    validate : function(node, expected, nodeName) 
    {
        if (typeof node === "undefined") {
            return true;
        }

        if (node.constructor !== eval(expected)) {
            throw new Error("Constructor of '" + nodeName + "' is not " + expected)
        }

        return true;
    }
};


module.exports = ConstructorConstraint;
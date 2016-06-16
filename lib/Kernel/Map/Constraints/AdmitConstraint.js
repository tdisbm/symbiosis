var Util = require("util");
var ConstraintInterface = require("./ConstraintInterface.js");


var AdmitConstraint = function()
{
    AdmitConstraint.super_.apply(this, arguments);
};


Util.inherits(AdmitConstraint, ConstraintInterface);


AdmitConstraint.prototype =
{
    validate : function(node, nodeName, expected) 
    {
        if (expected.indexOf(node) === -1) {
            throw new Error(
                "Property " + nodeName + " admit only " + expected.toString() + ", " + node + " given!"
            )
        }
    }
};


module.exports = AdmitConstraint;
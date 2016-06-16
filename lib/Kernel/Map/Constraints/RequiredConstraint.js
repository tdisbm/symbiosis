var Util = require("util");
var ConstraintInterface = require("./ConstraintInterface.js");


var RequiredConstraint = function() 
{
    RequiredConstraint.super_.apply(this, arguments);
};


Util.inherits(RequiredConstraint, ConstraintInterface);


RequiredConstraint.prototype = 
{
    validate : function(node, nodeName, expected)
    {
        if (expected === false) {
            return true;
        }

        if (typeof node === "undefined") {
            throw new Error("'" + nodeName + "' is required!");
        }

        return true;
    }
};


module.exports = RequiredConstraint;
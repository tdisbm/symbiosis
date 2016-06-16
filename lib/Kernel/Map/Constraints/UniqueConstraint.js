var Util = require("util");
var ConstraintInterface = require("./ConstraintInterface.js");

/**
 * @constructor
 */
var UniqueConstraint = function()
{
    UniqueConstraint.super_.apply(this, arguments);
    
    this.uniqueValues = [];
};


Util.inherits(UniqueConstraint, ConstraintInterface);


/**
 * @type {{validate: UniqueConstraint.validate, flush: UniqueConstraint.flush}}
 */
UniqueConstraint.prototype =
{
    /**
     * @param value string value to check if it's unique
     * @param node string node name
     */
    validate : function(value, node) 
    {
        if (-1 !== this.uniqueValues.indexOf(value)) {
            throw new Error('Value "' + value + '" is not unique on node ' + node)
        }

        if (typeof value === "object" && value.constructor === Array) {
            if ((new Set(value)).size !== value.length) {
                throw new Error ('Node ' + node + ' has duplicates');
            }
        }
        
        this.uniqueValues.push(value);
    },

    /**
     * clear all unique values to make possible
     * another value set validation
     */
    flush : function() {
        this.uniqueValues = [];
    }
};


/**
 * @type {UniqueConstraint}
 */
module.exports = UniqueConstraint;
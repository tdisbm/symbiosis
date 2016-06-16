var ConstraintInterface = function () 
{
    
};

ConstraintInterface.prototype = 
{
    validate : function ()
    {
        this._throwInterfaceViolationError();
    },

    _throwInterfaceViolationError : function ()
    {
        throw new Error("Child should implement methods from ConstraintInterface");
    }
};


module.exports = ConstraintInterface;
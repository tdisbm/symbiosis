var TestClass = function(io)
{
    
};


TestClass.prototype = 
{    
    map : function(query) 
    {
        query.email += '11';
    }
};


module.exports = TestClass;
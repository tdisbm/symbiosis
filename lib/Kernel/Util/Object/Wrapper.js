var Wrapper = function()
{
    
};


Wrapper.prototype =
{
    /**
     * @param f
     * @param args {Array}
     * @returns {*}
     */
    create : function(f, args) {
        var obj = Object.create(f.prototype);
        f.apply(obj, args);
        return obj;
    }
};


module.exports = new Wrapper();
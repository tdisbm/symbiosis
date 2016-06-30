/**
 * @constructor
 */
var ArrayCollection = function()
{
    this.items = [];
};


/**
 * @type {{
 *  addItem: ArrayCollection.add,
 *  removeItem: ArrayCollection.remove,
 *  getItem: ArrayCollection.getNode,
 *  iterate: ArrayCollection.iterate
 * }}
 */
ArrayCollection.prototype =
{
    /**
     * add a node to collection
     *
     * @param item
     * @returns {ArrayCollection}
     */
    addItem : function(item)
    {
        this.items.push(item);

        return this;
    },

    /**
     * remove a specific node from collection
     *
     * @param item
     * @returns {ArrayCollection}
     */
    removeItem : function(item)
    {
        delete this.items[this.items.indexOf(item)];

        return this;
    },

    /**
     * get node by name
     *
     * @param index
     * @returns {*}
     */
    getItem : function(index)
    {
        if (typeof this.items[index] === 'undefined') {
            return null;
        }

        return this.items[index];
    },

    /**
     * iterate through all collection nodes
     *
     * @param fn
     */
    iterate : function(fn)
    {
        if (typeof fn !== 'function') {
            return;
        }

        for (var i = 0, n = this.items.length; i < n; i++) {
            fn(this.items[i], i);
        }
    },
    
    clear : function()
    {
        this.items = [];
    },
    
    clone : function()
    {
        var clone = new ArrayCollection(); 
        
        for (var i = 0, n = this.items.length; i < n; i++) {
            clone.addItem(this.items[i]);
        }
        
        return clone;
    },
    
    count : function () 
    {
        return this.items.length;    
    }
};


/**
 * @type {ArrayCollection}
 */
module.exports = ArrayCollection;

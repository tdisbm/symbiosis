/**
 * @constructor
 */
var ObjectCollection = function()
{
    this.items = {};
};


/**
 * @type {{
 *  addItem: ObjectCollection.add,
 *  removeItem: ObjectCollection.remove,
 *  getItem: ObjectCollection.getNode,
 *  iterate: ObjectCollection.iterate
 * }}
 */
ObjectCollection.prototype =
{
    /**
     * add a node to collection
     * 
     * @param name
     * @param node
     * @returns {ObjectCollection}
     */
    addItem : function(name, node)
    {
        this.items[name] = node;
        
        return this;
    },

    /**
     * remove a specific node from collection
     * 
     * @param name
     * @returns {ObjectCollection}
     */
    removeItem : function(name) 
    {
        if (!this.items.hasOwnProperty(name)) {
            throw new Error ('Undefined node ' + name);
        }

        delete this.items[name];
        
        return this;
    },

    /**
     * get node by name
     * 
     * @param name
     * @returns {*}
     */
    getItem : function(name)
    {
        if (!this.items.hasOwnProperty(name)) {
            throw new Error ('Undefined node ' + name);
        }

        return this.items[name];
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
        
        for (var node in this.items) {
            if (!this.items.hasOwnProperty(node)) {
                continue;
            }

            fn(this.items[node], node);
        }
    },
    
    clear : function()
    {
        this.items = {};
    }
};


/**
 * @type {ObjectCollection}
 */
module.exports = ObjectCollection;

var ConstructorConstraint = require('./Constraints/ConstructorConstraint.js');
var RequiredConstraint = require('./Constraints/RequiredConstraint.js');
var UniqueConstraint = require('./Constraints/UniqueConstraint.js');

var FilePathResolver = require('../../Services/File/FilePathResolver.js');


/**
 * @param mapPath path to json map defined by user
 * @constructor
 */
var Map = function(mapPath)
{
    this._elements = require(FilePathResolver.getFullPath(mapPath));
    this._constraints = {};
    
    this._init();
};


/**
 * @type {{
 *  validate: Map.validate, 
 *  getElements: Map.getElements,
 *  _init: Map._init,
 *  _validateHandshake: Map._validateHandshake, 
 *  _initConstraints: Map._initConstraints
 * }}
 */
Map.prototype = {
    /**
     * validate provided by user map
     */
    validate : function()
    {
        this._constraints.required.validate(this._elements.nodes, 'Map');
        this._constraints.constructor.validate(this._elements.nodes, 'Array','Map');
        
        for (var i = 0, n = this._elements.nodes.length; i < n; i++) {            
            this._constraints.required.validate(
                this._elements.nodes[i].handshake,
                'handshake'
            );

            this._constraints.required.validate(
                this._elements.nodes[i].name,
                'name'
            );

            this._constraints.required.validate(
                this._elements.nodes[i].class,
                'class'
            );
            
            this._validateHandshake(this._elements.nodes[i].handshake);
        }
    },

    /**
     * get map elements
     * 
     * @returns {*}
     */
    getElements : function()
    {
        return this._elements;
    },

    /**
     * initialization method
     * 
     * @private
     */
    _init : function()
    {
        this._initConstraints();
        this.validate();
    },

    /**
     * validate map handshake parameters
     * 
     * @param handshake
     * @private
     */
    _validateHandshake : function(handshake)
    {
        var identifiers = 0;

        this._constraints.required.validate(
            handshake.parameters,
            'parameters'
        );

        for (var i = 0, n = handshake.parameters.length; i < n; i++) {
            if (!handshake.parameters[i].hasOwnProperty("options")) {
                continue;
            }
            
            for (var j = 0, l = handshake.parameters[i].options.length; j < l; j++) {
                if (handshake.parameters[i].options[j] === "identifier") {
                    identifiers++;
                }
            }

            this._constraints.required.validate(
                handshake.parameters[i].name,
                handshake.parameters[i].name
            );
            this._constraints.unique.validate(
                handshake.parameters[i].name,
                'handrshake parameter name'
            );
        }
        
        this._constraints.unique.flush();

        if (1 != identifiers) {
            throw new Error ('Handshake must have one identifier')
        }
        
        if (handshake.hasOwnProperty('mappers')) {
            for (i = 0, n = handshake.mappers.length; i < n; i++) {
                this._constraints.required.validate(
                    handshake.mappers[i].class,
                    'mapper class'
                );
            }
        }
    },

    /**
     * init set of constraints to validate map parameters
     * 
     * @private
     */
    _initConstraints : function()
    {
        this._constraints = {
            "constructor" : new ConstructorConstraint,
            "required" : new RequiredConstraint,
            "unique" : new UniqueConstraint
        }
    }
};


/**
 * @type {Map}
 */
module.exports = Map;
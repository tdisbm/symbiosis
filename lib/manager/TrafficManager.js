var utils   = require("./utils/loader.js");
var helpers = require("../helper/loader.js");

var TrafficManager = function(map, io) {
    if (typeof map === "undefined") {
        throw new Error("Traffic Manager Error: Map are not defined");
    }

    this.map = map;
    this.io = io;

    this.validators = require("../validator/loader.js")(this.map);
    this.validators["map"].validate();
    this.validators["entity"].validate();

    this.handshake = map.handshake;
    this.rooms = {};

    this.nodes = {};
    this.environments = {};

    this.init();
};

TrafficManager.prototype.get = function(property) {
    if (!this.hasOwnProperty(property)) {
        throw new Error("Resource manager didn't have property " + property)
    }

    return this[property];
};

TrafficManager.prototype.addRoom = function(config) {
    this.rooms[config.room] = this.rooms[config.room] || {};
    if (!this.rooms[config.room].hasOwnProperty(config.entity)) {
        this.rooms[config.room][config.entity] = config.room + "." + config.entity;
    }
};

TrafficManager.prototype.rewindRoom = function(config) {
    if (!io.sockets.adapter.rooms.hasOwnProperty(this.rooms[config.room][config.entity])) {
        delete this.rooms[config.room][config.entity];
    }

    if (Object.keys(this.rooms[config.room]).length === 0) {
        delete this.rooms[config.room];
    }
};

TrafficManager.prototype.getRoom = function(config) {
    return typeof this.rooms[config.room] === "undefined" &&
        typeof this.rooms[config.room][config.entity] === "undefined"
        ?   false
        :   this.rooms[config.room][config.entity];
};

TrafficManager.prototype.init = function() {
    var nodes = this.map.nodes;
    var environments = this.map.environments;

    /**
     * inti nodes
     */
    for (var node in nodes) {
        if (!nodes.hasOwnProperty(node)) {
            continue;
        }

        var nodePath = helpers["file"].getFullFilePath(nodes[node].entity);
        this.nodes[node] = require(nodePath);
    }

    /**
     * init environments
     */
    for (var environment in environments) {
        var environmentNodes = {};

        if (!environments.hasOwnProperty(environment)) {
            continue;
        }

        var nodesRef = this.nodes;
        var dependencies = this.validators["entity"].dependencies;
        environments[environment].nodes.forEach(function(node){
            environmentNodes[node] = new nodesRef[node](eval(dependencies.join(",")));
        });

        this.environments[environment] = new utils.environment(io, {
            "nodes" : environmentNodes,
            "streams" : environments[environment].streams
        });
    }
};

module.exports = TrafficManager;
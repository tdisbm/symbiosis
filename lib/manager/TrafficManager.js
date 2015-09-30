var utils   = require("./utils/loader.js");
var helpers = require("../helper/loader.js");

var TrafficManager = function(map, io) {
    this.map = map;
    this.io = io;

    this.validators = require("../validator/loader.js")(this.map);
    this.handshake = map.handshake;

    this.rooms = {};
    this.nodes = {};
    this.environments = {};
    this.streams = {};

    var thisObj = this;
    this.io.use(function(socket, next) {
        var query = socket.handshake.query;

        if (!query.hasOwnProperty(thisObj.handshake["entity-identifier"]) &&
            !query.hasOwnProperty(thisObj.handshake["entity-room"])) {
            return;
        }

        var config = {
            "entity" : query[thisObj.handshake["entity-identifier"]],
            "room"   : query[thisObj.handshake["entity-room"]]
        };
        thisObj.setRoom(config);

        socket.join(thisObj.getRoom(config));
        socket.on("disconnect", function(){
            thisObj.reevaluateRoom(config);
        });
        next();
    });

    this.init();
};

TrafficManager.prototype.get = function(property) {
    if (!this.hasOwnProperty(property)) {
        throw new Error("Resource manager didn't have property " + property)
    }

    return this[property];
};

TrafficManager.prototype.setRoom = function(config) {
    this.rooms[config.room] = this.rooms[config.room] || {};
    if (!this.rooms[config.room].hasOwnProperty(config.entity)) {
        this.rooms[config.room][config.entity] = config.room + "." + config.entity;
    }
    console.log(this.rooms);
    return this;
};

TrafficManager.prototype.getRoom = function(config) {
    return typeof this.rooms[config.room] === "undefined" &&
    typeof this.rooms[config.room][config.entity] === "undefined"
        ?   false
        :   this.rooms[config.room][config.entity];
};

TrafficManager.prototype.reevaluateRoom = function(config) {
    if (!io.sockets.adapter.rooms.hasOwnProperty(this.rooms[config.room][config.entity])) {
        delete this.rooms[config.room][config.entity];
    }

    if (Object.keys(this.rooms[config.room]).length === 0) {
        delete this.rooms[config.room];
    }
};

TrafficManager.prototype.init = function() {
    var nodes = this.map.nodes;
    var environments = this.map.environments;
    var dependencies = this.validators["entity"].dependencies;

    for (var node in nodes) {
        if (!nodes.hasOwnProperty(node)) {
            continue;
        }

        var obj = require(helpers["file"].getFullFilePath(nodes[node].entity));
        this.nodes[node] = new obj(eval(dependencies.join(",")));
    }

    var nodesRef = this.nodes;

    for (var environment in environments) {
        if (!environments.hasOwnProperty(environment)) {
            continue;
        }

        var environmentNodes = {};
        environments[environment].nodes.forEach(function(node){
            environmentNodes[node] = nodesRef[node];
        });

        if (environments[environment].hasOwnProperty("streams")) {
            for (var stream in environments[environment].streams) {
                if (!environments[environment].streams.hasOwnProperty(stream)) {
                    continue;
                }

                this.streams = new utils.stream({
                    "config" : environments[environment].streams[stream],
                    "nodes"  : environmentNodes,
                    "tm"     : this
                })
            }
        }

        this.environments[environment] = new utils.environment({
            "config" : environments[environment],
            "nodes"  : environmentNodes,
            "tm"     : this
        });
    }
};

module.exports = TrafficManager;
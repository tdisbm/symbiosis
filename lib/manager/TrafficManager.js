var utils   = require("../utils/loader.js");
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

    var $this = this;
    this.io.use(function(socket, next) {
        var query = socket.handshake.query;

        if (!$this.setRoom(query)) {
            return;
        }

        socket.join($this.getRoom(query));
        socket.on("disconnect", function(){
            $this.reevaluateRoom(config);
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

TrafficManager.prototype.setRoom = function(query) {
    var identifier = this.handshake["entity-identifier"];
    var room = this.handshake["entity-room"];

    if (!query.hasOwnProperty(identifier) &&
        !query.hasOwnProperty(room)) {
        return false;
    }

    if (!this.nodes.hasOwnProperty(query[identifier])) {
        return false;
    }

    this.rooms[query[room]] = this.rooms[query[room]] || {};
    if (!this.rooms[query[room]].hasOwnProperty(query[identifier])) {
        this.rooms[query[room]][query[identifier]] = query[room] + "." + query[identifier];
    }

    return this.rooms[query[room]][query[identifier]];
};

TrafficManager.prototype.getRoom = function(query) {
    var identifier = this.handshake["entity-identifier"];
    var room = this.handshake["entity-room"];

    return typeof this.rooms[query[room]] === "undefined" &&
    typeof this.rooms[query[room]][query[identifier]] === "undefined"
        ?   false
        :   this.rooms[query[room]][query[identifier]];
};

TrafficManager.prototype.reevaluateRoom = function(config) {
    if (!this.io.sockets.adapter.rooms.hasOwnProperty(this.rooms[config.room][config.entity])) {
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

                this.streams[environment] = new utils.stream({
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
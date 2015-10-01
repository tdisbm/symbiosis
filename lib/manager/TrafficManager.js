var environment = require("./Environment.js");
var helpers = require("../helper/loader.js");

var TrafficManager = function(map, io) {
    this.map = map;
    this.io = io;
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

TrafficManager.prototype.reevaluateRoom = function(query) {
    var identifier = this.handshake["entity-identifier"];
    var room = this.handshake["entity-room"];

    if (!this.io.sockets.adapter.rooms.hasOwnProperty(this.rooms[query[room]][query[identifier]])) {
        delete this.rooms[query[room]][query[identifier]];
    }

    if (Object.keys(this.rooms[query[room]]).length === 0) {
        delete this.rooms[query[room]];
    }
};

TrafficManager.prototype.init = function() {
    var nodes = this.map.nodes;
    var environments = this.map.environments;

    for (var node in nodes) {
        if (!nodes.hasOwnProperty(node)) {
            continue;
        }

        this.nodes[node] = require(helpers["file"].getFullFilePath(nodes[node].entity));
    }

    for (var envName in environments) {
        if (!environments.hasOwnProperty(envName)) {
            continue;
        }

        var environmentNodes = {};
        var nodesRef = this.nodes;

        environments[envName].nodes.forEach(function(node){
            if (environments[envName].nodes.indexOf(node) === -1) {
                return;
            }

            environmentNodes[node] = nodesRef[node];
        });

        this.environments[envName] = new environment({
            "config" : environments[envName],
            "nodes"  : environmentNodes,
            "tm"     : this
        });
    }
};

module.exports = TrafficManager;
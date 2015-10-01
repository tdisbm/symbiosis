var utils = require("../utils/loader.js");

var TrafficManager = function(map) {
    this.map = map;
    this.io = io;
    this.handshake = map.handshake;

    this.rooms = {};
    this.data = {};

    this.streams = {};
    this.registerStreams(this.map);

    var $this = this;

    this.io.use(function(socket, next) {
        var query = socket.handshake.query;
        var room = $this.setRoom(query);

        if (!room) {
            return;
        }

        socket.onevent = function (packet) {
            $this.setData(query, packet.data);
        };

        socket.join(room);
        next();
    });
};

TrafficManager.prototype.setRoom = function(query) {
    var identifier = this.handshake["entity-identifier"];
    var room = this.handshake["entity-room"];

    if (!query.hasOwnProperty(identifier) &&
        !query.hasOwnProperty(room) &&
        this.map.nodes.indexOf(query[identifier]) === -1
    ) {
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

TrafficManager.prototype.registerStreams = function(map) {
    for (var stream in map.streams) {
        if (!map.streams.hasOwnProperty(stream)) {
            continue;
        }

        this.streams[stream] = new utils.stream({
            "config" : map.streams[stream],
            "tm" : this
        });
    }
};

TrafficManager.prototype.setData = function(query, data) {
    var identifier = this.handshake["entity-identifier"];
    var room = this.handshake["entity-room"];

    if (!query.hasOwnProperty(identifier) &&
        !query.hasOwnProperty(room) &&
        this.map.nodes.indexOf(query[identifier]) === -1
    ) {
        return false;
    }

    this.data[query[identifier]] = this.data[query[identifier]] || {};
    this.data[query[identifier]][query[room]] = this.data[query[identifier]][query[room]] || {};
    this.data[query[identifier]][query[room]][data[0]] = data[1];

    return this;
};

TrafficManager.prototype.getData = function(node) {
    return this.data[node];
};

module.exports = TrafficManager;
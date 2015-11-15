var SocketStorage = function(symbiosis) {
    this.symbiosis = symbiosis;

    var $this = this;
    this.symbiosis.io.on("connect", function(socket){
        $this.setSocket(socket);
    });
};

SocketStorage.prototype.setSocket = function(socket) {
    var query = socket.handshake.query;
    var room = this.symbiosis.roomStorage.getRoom(query);
    var pieces = [];

    socket.leave(socket.id);

    if (!this.validateQuery(socket.handshake.query)) {
        socket.join(room);
        return;
    }

    for (var piece in this.symbiosis.map.handshake) {
        if (!this.symbiosis.map.handshake.hasOwnProperty(piece)) {
            continue;
        }

        if (typeof query[this.symbiosis.map.handshake[piece]] === "undefined") {
            continue;
        }

        pieces.push(query[this.symbiosis.map.handshake[piece]]);
    }

    var id = pieces.join(".");

    if (typeof this.symbiosis.io.sockets.adapter.rooms[room] !== "undefined" &&
        this.symbiosis.io.sockets.adapter.rooms[room][id] === true) {
        this.symbiosis.io.emit("error", { code : 2 });

        return;
    }

    socket.id = id;
    socket.join(room);
    console.log();
};

SocketStorage.prototype.validateQuery = function(query) {
    return query.hasOwnProperty(this.symbiosis.handshake["identifier"]) &&
        query.hasOwnProperty(this.symbiosis.handshake["room"]) &&
        query.hasOwnProperty(this.symbiosis.handshake["storage"]) &&
        this.symbiosis.map.nodes.indexOf(query[this.symbiosis.handshake["identifier"]]) !== -1;
};

SocketStorage.prototype.name = "socketStorage";

module.exports = SocketStorage;
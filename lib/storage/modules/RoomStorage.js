var RoomStorage = function(symbiosis) {
    this.rooms = {};
    this.symbiosis = symbiosis;

    var $this = this;
    this.symbiosis.io.use(function(socket, next) {
        if (!$this.setRoom(socket.handshake.query)) {
            return;
        }

        socket.on("disconnect", function(){
            $this.refresh(socket.handshake.query);
        });
        next();
    });
};

RoomStorage.prototype.setRoom = function(query) {
    if (!this.validateQuery(query)) {
        return false;
    }

    var identifier = this.symbiosis.handshake["identifier"];
    var room = this.symbiosis.handshake["room"];


    this.rooms[query[room]] = this.rooms[query[room]] || {};
    if (!this.rooms[query[room]].hasOwnProperty(query[identifier])) {
        this.rooms[query[room]][query[identifier]] = query[room] + "." + query[identifier];
    }

    return this;
};

RoomStorage.prototype.getRoom = function(query) {
    if (!this.validateQuery(query)) {
        return false;
    }

    var identifier = this.symbiosis.handshake["identifier"];
    var room = this.symbiosis.handshake["room"];

    var hasRoom = this.rooms.hasOwnProperty(query[room]);
    var hasIdentifier = hasRoom && this.rooms[query[room]].hasOwnProperty(query[identifier]);

    return hasIdentifier && hasRoom
    ?   this.rooms[query[room]][query[identifier]]
    :   false;
};

RoomStorage.prototype.validateQuery = function(query) {
    var identifier = this.symbiosis.handshake["identifier"];
    var room = this.symbiosis.handshake["room"];

    return query.hasOwnProperty(identifier) &&
        query.hasOwnProperty(room) &&
        this.symbiosis.map.nodes.indexOf(query[identifier]) !== -1;
};

RoomStorage.prototype.refresh = function(query) {
    if (!this.validateQuery(query)) {
        return false;
    }

    var identifier = this.symbiosis.handshake["identifier"];
    var room = this.symbiosis.handshake["room"];

    if (!this.symbiosis.io.sockets.adapter.rooms.hasOwnProperty(this.rooms[query[room]][query[identifier]])) {
        delete this.rooms[query[room]][query[identifier]];
    }

    if (Object.keys(this.rooms[query[room]]).length === 0) {
        delete this.rooms[query[room]];
    }
};

RoomStorage.prototype.name = "roomStorage";

module.exports = RoomStorage;
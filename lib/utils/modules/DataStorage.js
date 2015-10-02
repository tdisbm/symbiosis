var DataStorage = function(tm) {
    this.data = {};
    this.tm = tm;

    var $this = this;
    this.tm.io.on("connect", function(socket) {
        socket.on("disconnect", function(){
            $this.refresh(socket.handshake.query);
        })
    })
};

DataStorage.prototype.setData = function(query, data) {
    if (this.validateQuery(query)) {
        return;
    }

    var identifier = this.tm.handshake["identifier"];
    var storage = this.tm.handshake["storage"];
    var room = this.tm.handshake["room"];

    this.data[query[identifier]] = this.data[query[identifier]] || {};
    this.data[query[identifier]][query[room]] = this.data[query[identifier]][query[room]] || {};
    this.data[query[identifier]][query[room]][query[storage]] = this.data[query[identifier]][query[room]][query[storage]] || {};
    this.data[query[identifier]][query[room]][query[storage]][data[0]] = data[1];

    return this;
};

DataStorage.prototype.getData = function(node) {
    return this.data[node];
};

DataStorage.prototype.refresh = function(query){
    if (this.validateQuery(query)) {
        return;
    }

    var identifier = this.tm.handshake["identifier"];
    var storage = this.tm.handshake["storage"];
    var room = this.tm.handshake["room"];

    if (!this.tm.io.sockets.adapter.rooms.hasOwnProperty(this.tm.getRoom(query))) {
        delete this.data[query[identifier]][query[room]][query[storage]];
    }

    if (!Object.keys(this.data[query[identifier]][query[room]]).length) {
        delete this.data[query[identifier]][query[room]];
    }

    if (typeof this.data[query[identifier]] === "undefined") {
        delete this.data[query[identifier]];
    }
};

DataStorage.prototype.validateQuery = function(query) {
    return query.hasOwnProperty(this.tm.handshake["identifier"]) &&
        query.hasOwnProperty(this.tm.handshake["room"]) &&
        query.hasOwnProperty(this.tm.handshake["storage"]) &&
        this.tm.map.nodes.indexOf(query[this.tm.handshake["identifier"]]) === -1;
};

DataStorage.prototype.name = "dataStorage";

module.exports = DataStorage;
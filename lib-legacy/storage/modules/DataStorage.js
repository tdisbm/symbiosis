var DataStorage = function(symbiosis) {
    this.data = {};
    this.symbiosis = symbiosis;

    var $this = this;
    this.symbiosis.io.use(function(socket, next) {
        var onevent = socket.onevent;
        socket.onevent = function (packet) {
            $this.symbiosis.dataStorage.setData(socket.handshake.query, packet.data);
            onevent.call (this, packet);
        };

        socket.on("disconnect", function(){
            $this.refresh(socket.handshake.query);
        });
        next();
    })
};

DataStorage.prototype.setData = function(query, data) {
    if (!this.validateQuery(query)) {
        return false;
    }

    var identifier = this.symbiosis.handshake["identifier"];
    var storage = this.symbiosis.handshake["storage"];
    var room = this.symbiosis.handshake["room"];

    this.data[query[room]] = this.data[query[room]] || {};
    this.data[query[room]][query[identifier]] = this.data[query[room]][query[identifier]] || {};
    this.data[query[room]][query[identifier]][query[storage]] = this.data[query[room]][query[identifier]][query[storage]] || {};
    this.data[query[room]][query[identifier]][query[storage]][data[0]] = data[1];

    return this;
};

DataStorage.prototype.getData = function(node) {
    return this.data[node];
};

DataStorage.prototype.refresh = function(query){
    if (!this.validateQuery(query)) {
        return;
    }

    var identifier = this.symbiosis.handshake["identifier"];
    var storage = this.symbiosis.handshake["storage"];
    var room = this.symbiosis.handshake["room"];

    var hasRoom = this.data.hasOwnProperty(query[room]);
    var hasIdentifier = hasRoom && this.data[query[room]][query[identifier]];
    var hasStorage = hasIdentifier && this.data[query[room]][query[identifier]].hasOwnProperty(query[storage]);

    if (hasIdentifier && hasRoom && hasStorage) {
        delete this.data[query[room]][query[identifier]][query[storage]];
    }

    if (hasIdentifier && hasRoom) {
        delete this.data[query[room]][query[identifier]];
    }

    if (hasIdentifier) {
        delete this.data[query[room]];
    }
};

DataStorage.prototype.validateQuery = function(query) {
    return query.hasOwnProperty(this.symbiosis.handshake["identifier"]) &&
        query.hasOwnProperty(this.symbiosis.handshake["room"]) &&
        query.hasOwnProperty(this.symbiosis.handshake["storage"]) &&
        this.symbiosis.map.items.indexOf(query[this.symbiosis.handshake["identifier"]]) !== -1;
};

DataStorage.prototype.name = "dataStorage";

module.exports = DataStorage;
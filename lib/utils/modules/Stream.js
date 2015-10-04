var Stream = function(args) {
    this.channels = {};
    this.startOn = args.config.propagation.condition["start-on"].split(":");
    this.stopOn  = args.config.propagation.condition["stop-on"].split(":");
    this.symbiosis = args.symbiosis;
    this.config = args.config;

    var $this = this;

    this.conditions = {
        "hasSockets" : function(room) {
            return $this.symbiosis.io.sockets.adapter.rooms.hasOwnProperty(room);
        }
    };

    this.symbiosis.io.on("connect",function(socket){
        $this.refresh(socket, $this.symbiosis);

        socket.on("disconnect", function(){
            $this.refresh(socket, $this.symbiosis);
        });
    });

    this.streams = {
        "interval" : {
            "start" : function(id) {
                if ($this.channels[id] !== null) {
                    return;
                }

                $this.channels[id] = setInterval(function() {
                    var packet = {};

                    $this.config["data-from"].forEach(function(from) {
                        if (!$this.symbiosis.dataStorage.data.hasOwnProperty(id)) {
                            return;
                        }
                        packet[from] = $this.symbiosis.dataStorage.data[id][from] || {};
                    });
                    $this.config["data-to"].forEach(function(to) {
                        $this.config["socket-events"].forEach(function(event) {
                            $this.symbiosis.io.sockets.in($this.symbiosis.roomStorage.rooms[id][to]).emit(event, packet);
                        });
                    });
                }, args.config.propagation.timeout);
            },
            "stop"  : function(id) {
                clearInterval($this.channels[id]);
                $this.channels[id] = null;
            }
        }
    };
};

Stream.prototype.start = function(id) {
    if(!this.streams.hasOwnProperty(this.config.propagation.type)) {
        throw new Error("Invalid stream type");
    }

    this.streams[this.config.propagation.type].start(id);
};

Stream.prototype.stop = function(id) {
    if(!this.streams.hasOwnProperty(this.config.propagation.type)) {
        throw new Error("Invalid stream type");
    }

    this.streams[this.config.propagation.type].stop(id);
};

Stream.prototype.refresh = function(socket, symbiosis) {
    var query = socket.handshake.query;
    var identifier = query[symbiosis.handshake.identifier];
    var room = query[symbiosis.handshake.room];
    var $this = this;

    if (identifier !== this.startOn[0]) {
        return;
    }

    if (!this.getChannel(room)) {
        this.setChannel(room);
    }

    if (this.conditions[this.startOn[1]](symbiosis.roomStorage.getRoom(query)) === eval(this.startOn[2])) {
        this.start(room);
    }

    socket.on("disconnect", function(){
        if (identifier !== $this.stopOn[0]) {
            return;
        }

        if ($this.conditions[$this.stopOn[1]](symbiosis.roomStorage.getRoom(query)) === eval($this.stopOn[2])) {
            $this.stop(room);
        }
    });
};

Stream.prototype.getChannel = function(room) {
    return this.channels[room] || false;
};

Stream.prototype.setChannel = function(room) {
    return this.channels[room] = null;
};

Stream.prototype.collectData = function(nodes) {
    var data = {};
    var $this = this;

    nodes.forEach(function(node){
        data[node] = $this.symbiosis.dataStorage.getData(node);
    });

    return data;
};

Stream.prototype.name = "stream";

module.exports = Stream;
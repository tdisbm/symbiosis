var Stream = function(args) {
    var channel = null;
    var $this = this;

    this.startOn = args.config.propagation.condition["start-on"].split(":");
    this.stopOn  = args.config.propagation.condition["stop-on"].split(":");

    this.conditions = {
        "hasSockets" : function(room) {
            return io.sockets.adapter.rooms.hasOwnProperty(room);
        }
    };

    io.on("connect", function(socket){
        $this.refresh(socket, tm);
    });

    this.config = args.config;
    this.streams = {
        "interval" : {
            "start" : function() {
                if (channel !== null) {
                    return;
                }
                var data;

                channel = setInterval(function() {
                    data = $this.collectData($this.config["data-from"]);

                    for (var node in data) {
                        if (!data.hasOwnProperty(node)) {
                            continue;
                        }

                        for (var room in data[node]) {
                            if (!data[node].hasOwnProperty(room)) {
                                continue;
                            }

                            $this.config["data-to"].forEach(function(to){
                                $this.config["socket-events"].forEach(function(event){
                                    io.sockets.in(tm.rooms[room][to]).emit(event, data[node][room]);
                                })
                            })
                        }
                    }
                }, args.config.propagation.timeout);
            },
            "stop"  : function() {
                clearInterval(channel);
                channel = null;
            }
        }
    };
};

Stream.prototype.start = function() {
    if(!this.streams.hasOwnProperty(this.config.propagation.type)) {
        throw new Error("Invalid stream type");
    }

    this.streams[this.config.propagation.type].start();
};

Stream.prototype.stop = function() {
    if(!this.streams.hasOwnProperty(this.config.propagation.type)) {
        throw new Error("Invalid stream type");
    }

    this.streams[this.config.propagation.type].stop();
};

Stream.prototype.refresh = function(socket, tm) {
    var query = socket.handshake.query;
    var $this = this;

    if (query[tm.handshake["entity-identifier"]] !== this.startOn[0]) {
        return;
    }

    if (this.conditions[this.startOn[1]](tm.getRoom(query)) === eval(this.startOn[2])) {
        $this.start();
    }

    socket.on("disconnect", function(){
        if (query[tm.handshake["entity-identifier"]] !== $this.stopOn[0]) {
            return;
        }

        if ($this.conditions[$this.stopOn[1]](tm.getRoom(query)) === eval($this.stopOn[2])) {
            $this.stop();
        }

        tm.reevaluateRoom(query);
    });
};

Stream.prototype.collectData = function(nodes) {
    var data = {};

    nodes.forEach(function(node){
        data[node] = tm.getData(node);
    });

    return data;
};

Stream.prototype.name = "stream";

module.exports = Stream;
var Stream = function(args) {
    var entityIdentifier = args.tm.handshake["entity-identifier"];
    var entityRoom = args.tm.handshake["entity-room"];
    var channel = null;

    var conditions = {
        "hasSockets" : function(room) {
            return typeof args.tm.io.sockets.adapter.rooms.hasOwnProperty(room) !== "undefined";
        }
    };

    var startOn = args.config.propagation.condition["start-on"].split(":");
    var stopOn  = args.config.propagation.condition["start-on"].split(":");

    var $this = this;
    args.tm.io.on("connect", function(socket) {
        var query = socket.handshake.query;

        var room = $this.room = args.tm.getRoom(query);

        if (conditions[startOn[1]](room) === eval(startOn[2])) {
            $this.start();
        }

        socket.on("disconnect", function(){
            if (conditions[stopOn[1]](room) === eval(stopOn[2])) {
                $this.stop();
            }
        });
    });

    var config = args.config;
    this.propagation = args.config.propagation;
    this.streams = {
        "interval" : {
            "start" : function() {
                if (channel !== null) {
                    return;
                }
                channel = setInterval(function() {
                    config["socket-events"].forEach(function(event){
                        config.to.forEach(function(node){
                            io.sockets.in(node).emit(event, config.data);
                        });
                    })
                }, config.timeout);
            },
            "stop"  : function() {
                clearInterval(channel);
                channel = null;
            }
        }
    }
};

Stream.prototype.start = function() {
    if(!this.streams.hasOwnProperty(this.propagation.type)) {
        throw new Error("Invalid stream type");
    }

    this.streams[this.propagation.type].start();
};

Stream.prototype.stop = function() {
    if(!this.streams.hasOwnProperty(this.propagation.type)) {
        throw new Error("Invalid stream type");
    }

    this.streams[this.propagation.type].stop();
};

Stream.prototype.name = "stream";


module.exports = Stream;
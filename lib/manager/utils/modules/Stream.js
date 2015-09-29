var Stream = function(io, config) {
    this.type = config.type;
    this.io = io;

    var channel = null;

    this.streams = {
        "interval" : {
            "start" : function() {
                if (channel !== null) {
                    return;
                }
                channel = setInterval(function() {
                    config.events.forEach(function(event){
                        config.nodes.forEach(function(node){
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
    if(!this.streams.hasOwnProperty(this.type)) {
        throw new Error("Invalid stream type");
    }

    this.streams[this.type].start();
};

Stream.prototype.stop = function() {
    if(!this.streams.hasOwnProperty(this.type)) {
        throw new Error("Invalid stream type");
    }

    this.streams[this.type].stop();
};

Stream.prototype.name = "stream";


module.exports = Stream;
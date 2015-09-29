var device = function(io) {
    this.deviceData = {};
    this.events = {};

    io.on("connect", function(socket){
        console.log(io.sockets.adapter.rooms);
    });
};



module.exports = device;
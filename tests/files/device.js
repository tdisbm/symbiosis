var device = function(io) {
    this.deviceData = {};
    this.events = {};

    var $this = this;

    io.on("connect", function(socket){
        socket.on("put", function(deviceData){
            $this.deviceData = deviceData;
        })
    });
};


module.exports = device;
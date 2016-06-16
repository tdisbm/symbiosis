var app = require('express')();
var argv = require('yargs').argv;
var http = require('http');
var Symbiosis = require("../lib/Kernel/Symbiosis.js")("/map.json");

var io = Symbiosis.getIo();

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || argv.port;
var host = process.env.OPENSHIFT_NODEJS_IP || argv.host || "127.0.0.1";

http = http.createServer(app).listen(port, host, function () {
    console.log("✔ Express server listening at %s:%d ", host, port);
});

io.listen(http);

io.on('connect', function(socket) {
    var headers = socket.handshake.headers;
    
    console.info('[+] NEW CONNECTION: \n - Host: %s \n - User Agent: %s \n - Email: %s', 
        headers['host'], 
        headers['user-agent'],
        socket.handshake.query.email
    );
});
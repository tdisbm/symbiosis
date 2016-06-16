var io = require("socket.io-client");
var argv = require('yargs').argv;

var socket = io.connect("http://127.0.0.1:" + argv.port, {
    query : "email=" + argv.email + "&name1=" + argv.type + "&storage=" + argv.storage
});

socket.on("message", function(data) {
    console.log(data);
});

socket.on("error", function(data){
    console.log(data);
});

if (argv.type === "device") {
    console.log("i am device");
    setInterval(function(){
        socket.emit("message", {"test" : Math.random()});
        socket.emit("set-gpio-mask", {"i am data" : Math.random()});
    }, 2000);
}



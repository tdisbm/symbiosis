var io = require("socket.io-client");
var argv = require('yargs').argv;

var socket = io.connect("http://0.0.0.0:" + argv.port, {query : "email=" + argv.email + "&type=" + process.type + "&storage=" + process.storage});

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



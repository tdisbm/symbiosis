var io = require("socket.io-client");

var socket = io.connect("http://0.0.0.0:5000", {query : process.argv[2] + "&" + process.argv[3] + "&" + process.argv[4]});

socket.on("message", function(data) {
    console.log(data);
});

if (process.argv[2] === "type=device") {
    console.log("i am device");
    setInterval(function(){
        socket.emit("message", {"test" : Math.random()})
    }, 2000);
}



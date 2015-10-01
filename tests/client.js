var io = require("socket.io-client");

socket = io.connect("http://localhost:8000", {query : "type=device&email=user@mail.com"});

setInterval(function(){
    socket.emit("put", {"test" : Math.random()});
}, 2000);

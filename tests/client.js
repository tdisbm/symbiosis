var io = require("socket.io-client");

io.connect("http://localhost:8000", {query : "type=device&email=user@mail.com"});
const server = require('http').createServer();
const symbiosis = require('./../Symbiosis')('./map/map.json', server);

server.listen(9000);
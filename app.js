var argv = require('yargs').argv;

var map = require("./maps/map.json");
var app = require("./lib/Symbiosis.js")(map);

if (argv.port % 1 !== 0) {
    throw new Error("Invalid port!");
}

app.listen(argv.port);
/*var manager = require("../lib/manager/resource_manager.js");
var map = require("./map.json");

manager = new manager(map);
manager.parseNodes();
manager.parseEnvironments();*/

var io = require("socket.io")();
var map = require("./map.json");
var tm = require("../lib/manager/Symbiosis.js")(map, {"listen" : true, "port" : 8000});



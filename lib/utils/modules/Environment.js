var Environment = function(args) {
    this.nodes = args.nodes;
    this.config = args.config;
    this.rooms = {};

    /*args.tm.io.use(function(socket, next){

    });*/
};

Environment.prototype.name = "environment";

module.exports = Environment;
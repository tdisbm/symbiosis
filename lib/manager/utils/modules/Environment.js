var Environment = function(args) {
    this.nodes = args.nodes;
    this.config = args.config;
    this.rooms = {};



    
};

Environment.prototype.name = "environment";

module.exports = Environment;
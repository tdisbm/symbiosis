var Environment = function(args) {
    this.nodes = args.nodes;
    this.streams = args.streams;

    if (typeof this.streams !== "undefined") {

    }
};



Environment.prototype.name = "environment";

module.exports = Environment;
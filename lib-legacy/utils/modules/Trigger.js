var Trigger = function(args){
    this.config = args.config;
    this.symbiosis = args.symbiosis;

    var $this = this;
    this.symbiosis.io.use(function(socket, next){
        $this.config["socket-events"].forEach(function(event){
            socket.on(event, function(data){
                if (!$this.validate(socket.handshake.query, $this.config)) {
                    return;
                }


            });
        });

        next();
    });
};

Trigger.prototype.validate = function(query, config) {
    if (config.hasOwnProperty("data-to-one")) {
        if (!query.hasOwnProperty(config["data-to-one"].identifier)) {
            return false;
        }
    }

    return config["data-from"].indexOf(query[this.symbiosis.handshake.identifier]) !== -1;
};

Trigger.prototype.name = 'trigger';

module.exports = Trigger;
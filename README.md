<h1>Symbiosis 2.0</h1>

* map construction:
```javascript
nodes: {
  "name" : "node name",
  "class" : "path/to/js/class",
  "handshake" : {
    "parameters" : [
      {"name" : "type", "options" : ["required", "identifier"]},
      {"name" : "email"}
    ],
    "mappers": [
      {"class" : "path/to/js/class"},
      {"class" : "path/to/js/class"}
    ]
  }
}
```

* start io listener:
    command:
        node app/app --port=%port_number_of_io_listener%
    example:
        node app/app --port=9000

* test local:
    command: 
        node app/tests/client --port=%port_number_of_io_listener% --node=%node_name_from_map% and other parameters from handshake configuration
    example:
        node app/tests/client --port=9000 --node=user --email=test@email.dev

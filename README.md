This is a node.js web server that listens incoming post requests on port 3333, reads and decodes GTFS data and publishes decoded custom data to mqtt broker (https://github.com/maanteeamet/mosquitto-server).

To build and run: 

available --build-arg:

MQTTCLIENTPASS - should be same as mosquitto-server password

OTPURL - environment based OTPURL + /routing/v1/routers/estonia/index/graphql example: https://api.dev.peatus.ee/routing/v1/routers/estonia/index/graphql

`docker build -t gtfs/estonia --build-arg MQTTCLIENTPASS='newPassword' -f Dockerfile .`

`docker run -p 8080:3333 name/gtfs`

Should be run after mosquitto-server.
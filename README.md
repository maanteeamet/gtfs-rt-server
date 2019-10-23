#### Run on Docker

This is a node js service for currently reading data from file () and publishing decoded data to localhost mqtt (https://github.com/maanteeamet/mosquitto-server) broker on port 1883 which is described in Dockerfile.

to build and run: available --build-arg:

MQTTCLIENTPASS - should be same as mosquitto-server password

`docker build -t gtfs/estonia --build-arg MQTTCLIENTPASS='newPassword' -f Dockerfile .`

`docker run -p 8080:3333 name/gtfs`

should be run after mosquitto-server

For sending file data to server for decoding, use postman or node src/test_client.js
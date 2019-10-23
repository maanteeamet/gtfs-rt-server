const http = require('http');
const mqtt = require('mqtt');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

let client  = mqtt.connect("mqtt://test.mosquitto.org",{clientId:"mqttjs01"});
let port = 3333;
http.createServer(function (request, response) {
    response.write('Server is started.');
    response.end();

    if ("POST" === request.method) {
        // Get all post data when receive data event.
        let data = []; // List of Buffer objects
        request.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            data.push(chunk); // Append Buffer object
        }).on('end', () => {
            data = Buffer.concat(data);
            let msg = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(data);
            console.log("Data after decoding: " + JSON.stringify(msg.entity));

            client.on("connect",function(){
                console.log("connected  "+ client.connected);
                client.publish("TestTopic", JSON.stringify(msg.entity), function(error) {
                    if (error) {
                        console.log('Error happened when publishing: ' + error);
                    }
                });
            });
            client.on("error",function(error){
                console.log("Can't connect" + error);
                process.exit(1)
            });

        });
    }
}).listen(port);

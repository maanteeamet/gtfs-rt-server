const http = require('http');
const mqtt = require('mqtt');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const args = process.argv.splice(2);
let mqttClientUrl = args[0] || 'mqtt://localhost:1883';
let mqttClientUser = args[1] || 'publisher';
let mqttClientPassword = args[2];
let mqttClient =
    {
        url: mqttClientUrl,
        username: mqttClientUser,
        password: mqttClientPassword
    };

let serverPort = 3333;
let client  = mqtt.connect(mqttClient);

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

            if (client.connected === true){
                client.publish("gtfs-rt", JSON.stringify(msg.entity), function(error) {
                    console.log("Publishing.");
                    if (error) {
                        console.log('Error happened when publishing: ' + error);
                    }
                });
            }

            client.on("error",function(error){
                console.log("Can't connect" + error);
                process.exit(1)
            });

        });
    }
}).listen(serverPort);

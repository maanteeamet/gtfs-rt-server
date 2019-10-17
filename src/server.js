const http = require('http');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

let port = 3333;
http.createServer(function (request, response) {
    response.write('Server is started.');
    response.end();

    if ("POST" === request.method) {
        // Get all post data when receive data event.
        let data = []; // List of Buffer objects
        request.on('data', chunk => {
            data.push(chunk); // Append Buffer object
        });
        request.on('end', () => {
            data = Buffer.concat(data);
            let msg = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(data);
            console.log("Data after decoding: " + JSON.stringify(data));
            msg.entity.forEach(function (entity) {
                console.log("Entity: " + JSON.stringify(entity));
            });
        })
    }
}).listen(port);

let GtfsRealtimeBindings = require('gtfs-realtime-bindings');
let request = require('request');

let requestSettings = {
    method: 'GET',
    url: 'http://papi.elron.ee/public/gtfs/rt/VehiclePositions.pb',
    encoding: null
};
request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        feed.entity.forEach(function(entity) {
            console.log("Vehicle " + entity.vehicle.vehicle.label);
        });
    }
});
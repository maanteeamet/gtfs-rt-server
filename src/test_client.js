// client sends post request with file to gtfs-rt-server
let request = require('request');
let path = require('path');
let fs = require('fs');
let filename = '../gtfs-rt-server/TripUpdates.pb';
let target = 'http://localhost:3333/upload/' + path.basename(filename);

let rs = fs.createReadStream(filename);
let ws = request.post(target);

ws.on('drain', function () {
    console.log('drain', new Date());
    rs.resume();
});

rs.on('end', function () {
    console.log('uploaded to ' + target);
});

ws.on('error', function (err) {
    console.error('cannot send file to ' + target + ': ' + err);
});

rs.pipe(ws);
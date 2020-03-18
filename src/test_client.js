// client sends post request with file to gtfs-rt-server
let request = require('request');
let path = require('path');
let fs = require('fs');
let filename = '../gtfs-rt-server/VehiclePositions.pb';
let target = 'http://localhost:3333/' + path.basename(filename);
// let target = 'https://mqtt.dev.peatus.ee/gtfs/upload' + path.basename(filename);

setInterval(()=>{
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
}, 5000);


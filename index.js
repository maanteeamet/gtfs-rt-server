const rt = require('./src/rt_data_sync.js');
const http = require('http');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const args = process.argv.splice(2);
let mqttClientUrl = args[0] || 'mqtt://localhost:1883';
let mqttClientUser = args[1] || 'publisher';
let mqttClientPassword = args[2];
let otpurl = args[3];
let mqttClient =
  {
    url: mqttClientUrl,
    username: mqttClientUser,
    password: mqttClientPassword
  };

let sync = new rt.rt_data_sync(mqttClient, otpurl);
let serverPort = 3333;
console.log('starting server');
http.createServer(function (request, response) {
  var start = new Date();
  response.write('Server is running.');
  response.end();
  console.log('Get length: ' + (new Date() - start));

  if ("POST" === request.method) {
    // Get all post data when receive data event.
    let data = []; // List of Buffer objects
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      start = new Date();
      data.push(chunk); // Append Buffer object
    }).on('end', () => {
      data = Buffer.concat(data);
      console.log('Posting length: ' + (new Date() - start));
      console.log('converting and publishing data. data size: ' + data.length);
      let decodedGtfsData = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(data);
      sync.syncOtpAndGtfs(JSON.stringify(decodedGtfsData));
      console.log('converting and publishing finished')
    });
  }
}).listen(serverPort);




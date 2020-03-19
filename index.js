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

function logging(request, requestStart) {
  const {rawHeaders, httpVersion, method, socket, url} = request;
  const {remoteAddress, remoteFamily} = socket;

  console.log(
    JSON.stringify({
      timestamp: Date.now(),
      processingTime: Date.now() - requestStart,
      rawHeaders,
      httpVersion,
      method,
      remoteAddress,
      remoteFamily,
      url
    })
  )
}

console.log('starting server');
http.createServer(function (request, response) {
  var start = new Date();
  response.write('Server is running.');
  response.end();
  logging(request, start);

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
      let decodedGtfsData = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(data);
      sync.syncOtpAndGtfs(JSON.stringify(decodedGtfsData));
      logging(request, start);
    });
  }
}).listen(serverPort);




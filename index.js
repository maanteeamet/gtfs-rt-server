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

  if ('GET' === request.method) {
    response.write('Server is running.');
    response.end();
    logging(request, start);
  } else if ("POST" === request.method) {
    console.log(request);
    // Get all post data when receive data event.
    let data = []; // List of Buffer objects
    request.on('error', (err) => {
      console.error(err);
    });
    request.on('data', (chunk) => {
      start = new Date();
      data.push(chunk); // Append Buffer object
    });
    request.on('end', () => {
      data = Buffer.concat(data);
      try {
        let decodedGtfsData = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(data);
        console.log('received from post: ', JSON.stringify(decodedGtfsData));
        sync.syncOtpAndGtfs(JSON.stringify(decodedGtfsData), request.url);
        response.write('received');
      } catch (e) {
        response.write('failed: \n' + e);
        console.log(e);
      } finally {
        logging(request, start);
        response.end();
      }
    });
  }
}).listen(serverPort);




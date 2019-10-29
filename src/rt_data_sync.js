const mqtt = require('mqtt');
const otp_match = require('./otp_match.js');
const mqtt_publisher = require('./mqtt_publisher.js');

class Rt_data_sync {
  constructor(mqttClient, otpUrl) {
    this.clientUrl = mqttClient.url;
    let opts = {
      username: mqttClient.username,
      password: mqttClient.password
    };
    this.otpUrl = otpUrl;
    this.mqttClient = mqtt.connect(this.clientUrl, opts);
  }

  syncOtpAndGtfs(decodedGtfsData) {
    console.log('Syncing Tallinn RT data to mqtt client ' + this.clientUrl);
    new otp_match.OtpClient(this.handlePublish, {mqttClient: this.mqttClient}, this.otpUrl).connect(decodedGtfsData);
  };

  handlePublish(msg, args) {
    let topic = mqtt_publisher.to_mqtt_topic(msg);
    let message = mqtt_publisher.to_mqtt_payload(msg);
    args.mqttClient.publish(topic, JSON.stringify(message), function (err) {
      if (err) {
        console.log('Error happened when publishing: ' + err);
      }
    });
  };
}

module.exports.rt_data_sync = Rt_data_sync;



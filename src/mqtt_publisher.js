// Generated by CoffeeScript 2.3.2
(function() {
  let moment, mqtt_match, to_mqtt_payload, to_mqtt_topic;

  moment = require('moment-timezone');

  mqtt_match = function(pattern, topic) {
    let regex;
    regex = pattern.replace(/\+/g, "[^/]*").replace(/\/#$/, "/.*");
    return topic.match("^" + regex + "$");
  };

  to_mqtt_topic = function(msg) {
    let digit, digits, i, x, y;
    x = msg.position.latitude;
    y = msg.position.longitude;
    digit = function(x, i) {
      return "" + Math.floor(x * 10 ** i) % 10;
    };
    digits = (function() {
      let j, results;
      results = [];
      for (i = j = 1; j <= 3; i = ++j) {
        results.push(digit(x, i) + digit(y, i));
      }
      return results;
    })();
    let geohash = Math.floor(x) + ";" + Math.floor(y) + "/" + digits.join('/');
    let headsign = msg.trip.route; // not available from current sources

    let prefix = `hfp`;
    let version = `v1`;
    let journey_type = `journey`;
    let temporal_type = `ongoing`;
    let event_type; //not available from current resources
    let transport_mode = msg.vehicle.type;
    let operator_id = msg.trip.operator.id;
    let vehicle_number = msg.vehicle.id;
    let route_id = msg.trip.gtfsId;
    let direction_id = msg.trip.direction;
    let start_time = msg.trip.start_time;
    let next_stop;   //not available from current resources
    return `/${prefix}/${version}/${journey_type}/${temporal_type}/${event_type}/${transport_mode}/${operator_id}/${vehicle_number}/${route_id}/${direction_id}/${headsign}/${start_time}/${next_stop}/` + geohash;
  };

  to_mqtt_payload = function(msg) {
    let now, now_hour, oday, start_hour;
    now = moment().tz('Europe/Helsinki');
    // if there's start_time but no start_date, guess one
    if ((msg.trip.start_time != null) && (msg.trip.start_date == null)) {
      start_hour = parseInt(msg.trip.start_time.substring(0, 2));
      now_hour = now.hour();
      oday = moment().tz('Europe/Helsinki');
      if (start_hour > 16 && now_hour < 8) {
        // guess departure was yesterday instead of >8 hours in future
        oday.subtract(1, 'day');
      } else if (start_hour < 8 && now_hour > 16) {
        // guess departure is tomorrow instead of >8 hours ago
        oday.add(1, 'day');
      } else {
        oday = now;
      }
    } else {
      oday = void 0;
    }
    return {
      VP: {
        desi: msg.trip.route,
        dir: msg.trip.direction,
        oper: msg.trip.operator.id,
        veh: msg.vehicle.id,
        tst: moment(msg.timestamp * 1000).toISOString(),
        tsi: Math.floor(msg.timestamp),
        spd: Math.round(msg.position.speed * 100) / 100,
        hdg: msg.position.bearing,
        lat: msg.position.latitude,
        long: msg.position.longitude,
        dl: msg.position.delay,
        odo: msg.position.odometer,
        oday: msg.trip.start_day || (oday != null ? oday.format("YYYY-MM-DD") : void 0),
        jrn: "XXX", // we don't have departure id yet
        line: "XXX", // we don't have stop pattern id yet
        start: msg.trip.start_time,
        stop_index: msg.position.next_stop_index,
        source: msg.source
      }
    };
  };

  module.exports = {
    to_mqtt_topic: to_mqtt_topic,
    to_mqtt_payload: to_mqtt_payload,
    mqtt_match: mqtt_match
  };

}).call(this);

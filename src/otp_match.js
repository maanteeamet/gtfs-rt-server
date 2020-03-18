(function () {

  const request = require('request');

  module.exports.OtpClient = class OtpClient {
    constructor(callback, args, otpUrl) {
      this.callback = callback;
      this.args = args;
      this.routes = {
        "": {}
      };
      this.otpUrl = otpUrl;
    }

    get_route_data_from_otp(info, update_location) {
      if (parseInt(info.id) === 0) {
        return;
      }
      let bodyJson = {json: {query: '{ routes ( name: "' + info.id + '" ) { shortName gtfsId mode agency { name id } } }'}};
      request.post(this.otpUrl, bodyJson, (error, res, body) => {
        let self = this;
        if (error || !body.data) {
          console.error(error);
          return
        }
        let routes = body.data.routes;
        if (routes.length > 0) {
          let otpRoutes = routes.filter(function (route) {
            return (route.shortName === info.id);
          });
          otpRoutes.forEach((route) => {
            const tempInfo = {...info, type: route.mode.toLowerCase(), gtfsId: route.gtfsId, operator: route.agency};
            update_location(tempInfo, self);
          });
        }
      });
    };

    update_location(info, self) {
      const date = new Date();
      let out_info;

      out_info = {
        vehicle: {
          id: info.vehicle.vehicle.id,
          label: info.vehicle.vehicle.label,
          type: info.type
        },
        trip: {
          gtfsId: info.gtfsId.split(':')[1],
          route: info.vehicle.trip.tripId,
          direction: 0,
          operator: info.operator,
          headsign: info.lineNumber,
          start_time: ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)
        },
        position: {
          latitude: info.vehicle.position.latitude,
          longitude: info.vehicle.position.longitude,
          //odometer: parseFloat info.distance_from_start
          speed: info.vehicle.position.speed / 3.6,
          bearing: info.vehicle.position.heading
        },
        //delay: -(parseFloat info.difference_from_timetable)
        timestamp: new Date().getTime() / 1000
      };
      return self.callback(out_info, self.args);
    }

    connect(decodedGtfsData) {
      let entity = JSON.parse(decodedGtfsData).entity;
      if (entity) {
        entity.forEach((routeInfo) => {
          this.get_route_data_from_otp(routeInfo, this.update_location);
        });
      }
    }

  };

}).call(this);
  
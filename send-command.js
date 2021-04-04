const axios = require('axios');
const SwitchBotAPIClient = require('./switchbot-api-client');

var globalContext;

module.exports = function(RED) {
    function sendCommandNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.device_id = config.device_id;
        this.device_type = config.device_type;
        this.command = config.command;
        this.parameter = config.parameter;
        this.authorization = RED.nodes.getNode(config.authorization);

        globalContext = this.context().global;

        node.on('input', function(msg, send, done) {
          fetchDevices(this.authorization.token, globalContext, false, this.device_type)
            .then(id => sendCommandToDevice(this.authorization.token, this.device_id, this.command, this.parameter))
            .then(data => {
              this.status({fill: 'green', shape: 'dot', text: 'Success'});

              msg.payload = {
                'status': 'success',
                'message': `Successfully executed command '${this.command}' on ${this.device_id}`,
                'data': {
                  'deviceId': this.device_id,
                  'command': this.command,
                  'parameter': this.parameter
                }
              };

              node.send(msg);
            })
            .catch(error => {
              this.status({fill: 'red', shape: 'ring', text: 'Error'});

              if (done) {
                done(error);
              } else {
                node.error(error, msg);
              }
            });
        });
    }

    function fetchDevices(token, globalContext, forceRefresh, device_type) {
      return new Promise(function(resolve, reject) {
        var stored_devices = device_type == 'infrared' ? globalContext.get('switchbot_infraredRemoteList') : globalContext.get('switchbot_deviceList');
        if (stored_devices === undefined || forceRefresh === true) {
          var client = new SwitchBotAPIClient(token);
          client.fetchDevices()
            .then(data => {
              var fetchedDevices = device_type == 'infrared' ? data.infraredRemoteList : data.deviceList;

              globalContext.set('switchbot_infraredRemoteList', data.infraredRemoteList);
              globalContext.set('switchbot_deviceList', data.deviceList);

              resolve(fetchedDevices);
            })
            .catch(error => {
              reject(error);
            });
        } else {
          resolve(stored_devices);
        }
      });
    }

    function sendCommandToDevice(token, id, command, parameter) {
      if (id == null) {
        return;
      }

      return new Promise(function(resolve, reject) {
        var client = new SwitchBotAPIClient(token);
        client.sendCommandToDevice(id, command, 'command', parameter)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    }

    RED.httpAdmin.get("/switchbot/devices/:device_type", RED.auth.needsPermission('send-command.read'), function(req, res) {
      fetchDevices(req.query.token, globalContext, req.query.forceRefresh === 'true', req.params.device_type)
        .then(data => {
          res.json(data);
        })
        .catch(error => {
          res.sendStatus(500);
        });
    });

    RED.nodes.registerType('send-command', sendCommandNode);
}
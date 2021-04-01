const axios = require('axios');
const SwitchBotAPIClient = require('./switchbot-api-client');

module.exports = function(RED) {
    function sendCommandNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.device_name = config.device_name;
        this.command = config.command;
        this.parameter = config.parameter;
        this.infrared = config.infrared;
        this.custom_button = config.custom_button;
        this.authorization = RED.nodes.getNode(config.authorization);

        node.on('input', function(msg, send, done) {
          var globalContext = this.context().global;
          let client = new SwitchBotAPIClient(this.authorization.token);

          fetchDevices(client, globalContext, this.infrared)
            .then(devices => getDeviceId(devices, this.device_name))
            .then(id => sendCommandToDevice(client, id, this.command, this.custom_button, this.parameter))
            .then(data => {
              this.status({fill: 'green', shape: 'dot', text: 'Success'});

              msg.payload = `Successfully executed command '${this.command}' on ${this.device_name}'`;
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

    function fetchDevices(client, globalContext, infrared) {
      return new Promise(function(resolve, reject) {
        var stored_devices = infrared ? globalContext.get('switchbot_infraredRemoteList') : globalContext.get('switchbot_deviceList');

        if (stored_devices === undefined) {
          client.fetchDevices()
            .then(data => {
              var devices;
              if (infrared) {
                devices = data.infraredRemoteList;
                globalContext.set('switchbot_infraredRemoteList', devices);
              } else {
                devices = data.deviceList;
                globalContext.set('switchbot_deviceList', devices);
              }

              resolve(devices);
            })
            .catch(error => {
              reject(error);
            });
        } else {
          resolve(stored_devices);
        }
        
      });
    }

    function getDeviceId(devices, name) {
      return new Promise(function(resolve, reject) {
        let device = devices.find(device => device.deviceName === name);
        if (device) {
          resolve(device.deviceId);
        } else {
          reject('Device not found');
        }
      });
    }

    function sendCommandToDevice(client, id, command, custom_button, parameter) {
      return new Promise(function(resolve, reject) {
        let commandType = custom_button ? 'customize' : 'command';
        client.sendCommandToDevice(id, command, commandType, parameter)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    }

    RED.nodes.registerType('send-command', sendCommandNode);
}
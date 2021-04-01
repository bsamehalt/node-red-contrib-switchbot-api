const axios = require('axios')
    
const httpClient = axios.create({
    baseURL: 'https://api.switch-bot.com/v1.0/',
});

class SwitchBotAPIClient {

  constructor(authorization_token) {
    httpClient.defaults.headers.common['Authorization'] = authorization_token
  }

  fetchDevices() {
  	return new Promise(function(resolve, reject) {
  		httpClient.get('devices')
	  	.then(res => {
	        if(res.data.statusCode == 100) {
	          resolve(res.data.body);
	        } else {
	          reject(res.data);
	        }
	  	})
	    .catch(error => {
	      reject(error);
	   	})
	  });
  }

  sendCommandToDevice(id, command, commandType, parameter) {
  	return new Promise(function(resolve, reject) {
  		httpClient.post(`devices/${id}/commands`, 
  			{
          command: command,
          parameter: parameter,
          commandType: commandType
        })
        .then(res => {
            if(res.data.statusCode == 100) {
	          	resolve(res.data);
		        } else {
		          reject(res.data);
		        }
        })
        .catch(error => {
          reject(error);
        })
	  });
  }
}

module.exports = SwitchBotAPIClient;
## Getting Started

:warning: | This is **not** an official package and is in no way related to SwitchBot.
:---: | :---

### Prerequisites
- Node.js v10.0+
- Node-RED v1.0+

### Installation
#### Install via Node-RED
Just search for `node-red-contrib-switchbot-api` in the Pallete section (under the Install tab)

#### Install via npm
1. Navigate to your `.node-red` folder:
`cd ~/.node-red`

2. Install the package:
`npm install node-red-contrib-switchbot-api`

3. Restart `node-red`


### Available Nodes
At the moment, `send command` is the only available node type, which allows you to control SwitchBot devices (and remotes) via their web APIs; authorization is done via an API token which you can generate using SwitchBot's official mobile app:
1. Download the SwitchBot app from the App Store or Google Play Store
2. Register a SwitchBot account and login to your account
3. Generate an Open Token within the app a) Go to Profile > Preference b) Tap App Version 10 times. Developer Options will show up c) Tap Developer Options d) Tap Get Token

#### Inputs
##### Device name
The name of the device.

##### Infrared
Check this if you're controlling an infrared remote.

##### Command
The command you would like to pass to the device/remote. Full list of commands can be found [here](https://github.com/OpenWonderLabs/SwitchBotAPI#send-device-control-commands) *(this will take you to SwitchBot's official API documentation page)*

##### Custom button
Check this if the button is a custom one you made. Applicable for infrared devices only.

##### Parameter
A custom parameter in case it is required by the command. Full list of commands along with their parameters can be found [here](https://github.com/OpenWonderLabs/SwitchBotAPI#send-device-control-commands) *(this will take you to SwitchBot's official API documentation page)*. 
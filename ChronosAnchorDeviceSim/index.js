  
'use strict';

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;

var connectionString = process.env["AzureIoTHubDeviceConnectionString"];
var messageCount = process.env["AzureIoTHubDeviceMessageCount"] || 1;

module.exports = async function (context, myTimer) {
    context.log('Chronos Anchor Simulator started.');
    context.log(messageCount);
    var timeStamp = new Date().toISOString();

    if(!connectionString || 0 === connectionString.length){
        context.log("IoT Device Connection String is not configured!");
        return;
    }   
    
    var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

    var i;
    var now = new Date;
    for(i = 1; i < 1 + parseInt(messageCount); i++)
    {
        var body = {
            timestamp: now.getTime(),
            id:"SGFTDemo_ChronosTag_" + i,
            value: 10 + (Math.random() * 20)
          };
        
        var messageBody = JSON.stringify(Object.assign({}, body));
        context.log(messageBody);

        var messageBytes = Buffer.from(messageBody, "utf-8");

        var message = new Message(messageBytes);        
        message.contentType = 'application/json';
        message.contentEncoding = 'utf-8';
    
        // Send the message.
        client.sendEvent(message, function (err) {
            if (err) {
            console.error('send error: ' + err.toString());
            } else {
            console.log('message sent' );
            }
        });
    }

    context.log('Chronos Anchor Simulator message sending is completed!', timeStamp);
}
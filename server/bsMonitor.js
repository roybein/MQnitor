/*
// a mqtt test
mqttClient = mqtt.connect('mqtt:accrete.org');

mqttClient.on("connect", function() {
		console.log("connected accrete mqtt");

		mqttClient.publish("presence", "hello mqtt from meteor", function() {
				console.log("publish done");
		});

		mqttClient.subscribe("presence", function() {
				console.log("subscribe done");
		});

		mqttClient.on("message", function(p1, p2) {
			console.log(p1, p2.toString());
		});
});
*/

// call a fake module
fakelog();

// init some fake sensors
var sensorLight = new Sensor( Sensors, "0001", "light", "lux", 777, "a fake sensor");
var sensorTemperature = new Sensor( Sensors, "0004", "temperature", "C", 24, "a fake sensor");
var sensorHumidity = new Sensor( Sensors, "0007", "humidity", "%", 65, "a fake sensor");
var sensorVoltage = new Sensor( Sensors, "0009", "voltage", "volt", 3200, "a fake sensor");

// int some fake relays
var relayMasterPower = new Relay( Relays, "0001", "master power", "on", null);

// register a listener on data collection Sensors
var querySensors = Sensors.find();

var handle = querySensors.observeChanges({
		changed: function(id, fields) {
			// Call judge here
			console.log(fields);
		}
});


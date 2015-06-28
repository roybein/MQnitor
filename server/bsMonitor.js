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
/*
// init fake sensors
sensorAll = new SensorBase(new Mongo.Collection("sensors"));
var sensorLight = new Sensor(1, "light", "lux", 777, "a fake sensor");
sensorAll.addSensor(sensorLight);
*/
/*
var sensorTemperature = new Sensor( Sensors, 4, "temperature", "C", 24, "a fake sensor");
var sensorHumidity = new Sensor( Sensors, 7, "humidity", "%", 65, "a fake sensor");
var sensorVoltage = new Sensor( Sensors, 9, "voltage", "volt", 3200, "a fake sensor");
*/
/*
// int fake relays
var relayMasterPower = new Relay( Relays, 1, "master power", "on", null);
*/
/*
// int fake Judge
var judgeEleTest = new JudgeElement(1, sensorLight.index, 500, 600, true);
var judgeTest = new Judge(JudgeGroup, 1, []);
judgeTest.addElement(judgeEleTest);
console.log(judgeTest.judgeMap[1]);
*/

// register a listener on data collection Sensors
var querySensors = sensorAll.collec.find();

var handle = querySensors.observeChanges({
		changed: function(id, fields) {
			// Call judge here
			console.log(fields);
		}
});


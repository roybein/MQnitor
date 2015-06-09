Router.route('/', function () {
	this.redirect('/monitor');
});

Router.route('/monitor');

Router.route('/setup');

Sensors = new Mongo.Collection("sensors");
DigitalInputs = new Mongo.Collection("digitalInputs");
AnalogInputs = new Mongo.Collection("analogInputs");
Relays = new Mongo.Collection("relays");

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

if(Meteor.isClient) {
	Template.monitor.helpers({
		sensors: function() {
			return Sensors.find({});
		},

		digitalInputs: function() {
			return DigitalInputs.find({});
		},

		analogInputs: function() {
			return AnalogInputs.find({});
		},

		relays: function() {
			return Relays.find({});
		}
	});
}

/*
if (Meteor.isClient) {
	Template.monitor.helpers({
		sensors: [
			{	index: "0001",
				name: "sensor 0001",
				value: "24",
				description: "connect with the kettle",
			},
			{	index: "0002",
				name: "sensor 0002",
				value: "89",
				description: "connect with the fireplace",
			},
		],

		digitalInputs: [
			{	name: "Digital Input 1",
				status: "Alarm",
			},
			{	name: "Digital Input 2",
				status: "Open",
			},
		],

		analogInputs: [
			{	name: "Analog Input 1",
				value: "23",
			},
			{	name: "Analog Input 2",
				value: "12",
			},
		],

		relays: [
			{	name: "Relay 1",
				status: "OFF",
				control: "schedule a",
			},
			{	name: "Relay 2",
				status: "ON",
				control: "schedule c",
			},
			{	name: "Relay 3",
				status: "OFF",
				control: "schedule f",
			},
		]
	});
}
*/


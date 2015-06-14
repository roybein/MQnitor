Router.route('/', function () {
	this.redirect('/monitor');
});

Router.route('/monitor');

Router.route('/setup');

Sensors = new Mongo.Collection("sensors");
DigitalInputs = new Mongo.Collection("digitalInputs");
AnalogInputs = new Mongo.Collection("analogInputs");
Relays = new Mongo.Collection("relays");

/*
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
		},

	});

	Template.monitor.events({
	  "submit form": function (event, template) {
	    var inputValue = event.target.myInput.value;
	    var helperValue = this;
	    alert(inputValue);
	  }
	});

	Template.example.events({
	  "click .alert": function (event, template) {
	    alert("My button was clicked!");
	  },
	  "submit form": function (event, template) {
	    var inputValue = event.target.myInput.value;
	    var helperValue = this;
	    alert(inputValue);
	  }
	});

	Template.relay.helpers({
		relayOffCheck: function() {
			console.log(this.name);
			return this.status === "off" ? 'checked' : '';
		},
		
		relayOnCheck: function() {
			return this.status === "on"? 'checked' : '';
		},

		relayAutoCheck: function() {
			return this.status === "auto"? 'checked' : '';
		},

		schedule: function() {
			if(this.status === "auto") {
				return this.schedule;
			} else {
				return "";
			}
		}
	});

	Template.relay.events({
	  "change .relay-control": function (event, template) {
			var element = event.target;
			console.log(element.value);
			Relays.update({_id:Relays.findOne({id:element.id})['_id']}, {$set:{status:element.value}});
	  }
	});
}



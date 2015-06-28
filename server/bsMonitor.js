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

// register a listener on data collection Sensors
var querySensors = sensorAll.collec.find();

var handle = querySensors.observeChanges({
		changed: function(id, fields) {
			console.log("id=", id, "fields=", fields);
            if(Object.keys(fields) == 'value') {
                var sensor = sensorAll.getSensor(id);
                console.log(sensor.name);
                  
                var pIdG = sensorAll.collec.findOne({_id:id}).planIdGroup;
                pIdG.forEach(function(elem, index, group) {
                    planAll.checkPlan(elem);
                });
            }
		}
});


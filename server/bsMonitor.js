// a mqtt test
/*
mqttClient = mqtt.connect('mqtt:accrete.org');

mqttClient.on("connect", function() {
		console.log("connected accrete mqtt");

		mqttClient.publish("presence", "hello mqtt from meteor", function() {
				console.log("publish done");
		});

		mqttClient.subscribe("/nodemcu/input", function() {
				console.log("subscribe done");
		});

		mqttClient.on("message", function(p1, p2) {
			console.log(p1, p2.toString());
            if (parseInt(p2) > 900) {
                console.log("turn on");
                mqttClient.publish("/nodemcu/output", "1");
            } else {
                console.log("turn off");
                mqttClient.publish("/nodemcu/output", "0");
            }
		});

});
*/

// register a listener on data collection Sensors
var queryInput = contactAll.collec.find({direction:"input"});

var handle = queryInput.observeChanges({
		changed: function(id, fields) {
			console.log("_id=", id, "fields=", fields);
            if( (Object.keys(fields) == 'value') ||
                (Object.keys(fields) == 'time') ||
                (Object.keys(fields) == 'weekday') ) {
                var pIdG = contactAll.collec.findOne({_id:id}).planIdGroup;
                pIdG.forEach(function(elem, index, group) {
                    planAll.checkPlan(elem);
                });
            }
		}
});


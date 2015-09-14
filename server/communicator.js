// a mqtt test

mqttClient = mqtt.connect('mqtt:123.57.208.39');

mqttClient.on("connect", function() {
    console.log("connected mqtt broker");

    mqttClient.publish("presence", "hello mqtt from bsMonitor", function() {
        console.log("publish done");
    });

    mqttClient.subscribe("/#", function() {
            console.log("subscribe done");
    });

    mqttClient.on("message", onMsgMqtt);
/*
 function(p1, p2) {
        var Fiber = Npm.require('fibers');
        Fiber(function() {
            console.log("I am in a fiber");
            console.log(contactAll.collec.findOne({direction:"input"}));
        }).run();
        //console.log(Fiber(contactAll.collec.findOne("direction:input")));
    });
/*
        if (parseInt(p2) > 900) {
            console.log("turn on");
            mqttClient.publish("/nodemcu/output", "1");
        } else {
            console.log("turn off");
            mqttClient.publish("/nodemcu/output", "0");
        }
*/
});

onMsgMqtt = function(topic, message) {
    var tpArray = topic.split("/"); 
    console.log(tpArray, message.toString());
    if (tpArray.shift() !== "") {
        console.log("unsupported message start without /");
        return -1;
    }

    var tpKey = tpArray.shift();
    switch(tpKey) {
        case "up":
            onMsgUp(tpArray, message);
            break;
        case "down":
            console.log("get down message");
            break;
        default:
            console.log("unsupported topic key:", tpKey );
    }
}

onMsgUp = function(topic, message) {
    var tpKey = topic.shift();
    switch(tpKey) {
        case "bs":
            onMsgUpBs(topic, message);
            break;
        default:
            console.log("unsupported topic key:", tpKey );
    }
}

onMsgUpBs = function(topic, message) {
    var tpKey = topic.shift();
    switch(tpKey) {
        case "checkin":
            onMsgUpBsCheckin(topic, message);
            break;
        default:
            onMsgUpBsTarget(tpKey, topic, message);
    }
}

onMsgUpBsCheckin = function(topic, message) {
    console.log("checkin:", message.toString()); 
}

onMsgUpBsTarget = function(target, topic, message) {
    var Fiber = Npm.require('fibers');
    Fiber(function() {
        console.log("I am in a fiber");
        if (Meteor.users.findOne({username: target}) !== undefined) {
            console.log("message from:", target);
            var tpKey = topic.shift();
            switch(tpKey) {
                case "input":
                    onMsgUpBsTargetInput(target, topic, message);
                break;
                default:
                    console.log("unsupported topic key:", tpKey );
            }
        } else {
            console.log("unrecognized user:", target);
        }
    }).run();
}

onMsgUpBsTargetInput = function(target, topic, message) {
    var tpKey = topic.shift();
    contactAll.collec.update({owner:target, localId:tpKey}, {$set:{value:message.toString()}});
    console.log("update input:", target, tpKey, message);
}

doMsgDown = function(topic, message) {
    mqttClient.publish(topic, message);
}

doMsgDownBsTargetOutput = function(target, outputId, value) {
    var topic = "/down/bs/" + target + "/output" + outputId;
    doMsgDown(topic, value);
}


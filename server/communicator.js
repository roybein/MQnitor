
mqttClient = mqtt.connect('mqtt:123.57.208.39');

mqttClient.on("connect", function() {
    console.log("connected mqtt broker");

    mqttClient.publish("presence", "hello mqtt from bsMonitor", function() {
        console.log("publish done");
    });

    doMsgDown("/test", "test publish");

    mqttClient.subscribe("/#", function() {
            console.log("subscribe done");
    });

    mqttClient.on("message", onMsgMqtt);
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
    var target = message.toString();
    console.log("checkin:", target);
    var config = configAll.findOne({owner:target});
    if (config === null) {
    } else {
        Session.set("config@" + target, EJSON.toJSONValue(config));
    }
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
    console.log("publish", topic, message);
    mqttClient.publish(topic, message);
}

doMsgDownBsTargetOutput = function(target, outputId, value) {
    var topic = "/down/bs/" + target + "/output" + outputId;
    doMsgDown(topic, value);
}

doMsgDownBsTargetConfig = function(target, config) {
    var topic = "/down/bs/" + target + "/config";
    doMsgDown(topic, config);
}

Meteor.methods({
    doMsgDownBsTargetConfig: doMsgDownBsTargetConfig,
});

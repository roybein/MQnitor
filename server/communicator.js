function getIPAddress() {
  var interfaces = Npm.require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }

  return '0.0.0.0';
}

console.log(getIPAddress());

mqttClient = mqtt.connect('mqtt:123.57.208.39');
//mqttClient = mqtt.connect('mqtt:iot.eclipse.org');

mqttClient.on("connect", function() {
    console.log("connected mqtt broker");

    mqttClient.publish("presence", "hello mqtt from bsMonitor", function() {
        console.log("publish done");
    });

    doMsgDown("/test", "test publish");

    mqttClient.subscribe("/up/#", function() {
            console.log("subscribe done");
    });

    mqttClient.on("message", onMsgMqtt);
});

onMsgMqtt = function(topic, message) {
    var tpArray = topic.split("/"); 
    //console.log(tpArray, message.toString());
    if (tpArray.shift() !== "") {
        console.log("unsupported message start without /");
        return -1;
    }
/*
    if (tpArray.shift() !== "dev") {
        console.log("do not handle message non dev");
        return -1;
    }else {
        console.log("dev message");
    }
*/
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
    doMsgDownBsTargetConfig(target);
}

onMsgUpBsTarget = function(target, topic, message) {
    var Fiber = Npm.require('fibers');
    Fiber(function() {
        console.log("I am in a fiber");
        if (Meteor.users.findOne({username: target}) !== undefined) {
            //console.log("message from:", target);
            var tpKey = topic.shift();
            switch(tpKey) {
                case "input":
                    onMsgUpBsTargetInput(target, topic, message);
                    break;
                case "output":
                    onMsgUpBsTargetOutput(target, topic, message);
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
    var value = parseInt(message.toString());
    contactAll.collec.update({owner:target, localName:tpKey},
        {$set:{value:value}});
    console.log("update input:", target, tpKey, value);
}

onMsgUpBsTargetOutput = function(target, topic, message) {
    var tpKey = topic.shift();
    contactAll.collec.update({owner:target, localName:tpKey},
        {$set:{value:message.toString()}});
    console.log("update output:", target, tpKey, message);
}

doMsgDown = function(topic, message) {
    console.log("publish", topic, message);
    mqttClient.publish(topic, message, {qos:1});
}

doMsgDownBsTargetOutput = function(target, outputId, value) {
    var topic = "/down/bs/" + target + "/output/" + outputId;
    doMsgDown(topic, value);
}

getCurrentConfig = function(target) {
        var config = "";
        contactAll.collec.find({owner:target, port:"digital"},
            {fields: {localName:1, type:1, _id:0}}).forEach( function(doc) {
            config = config + doc.localName + ':' + doc.type + ',';
        });
        console.log("get config:", config);
        return config;
}

doMsgDownBsTargetConfig = function(target) {
    var Fiber = Npm.require('fibers');
    Fiber(function() {
        var topic = "/down/bs/" + target + "/config";
        config = getCurrentConfig(target);
        doMsgDown(topic, config);
    }).run();
}

Meteor.methods({
    doMsgDownBsTargetOutput: doMsgDownBsTargetOutput,
    doMsgDownBsTargetConfig: doMsgDownBsTargetConfig,
});

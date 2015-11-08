/*
Meteor.methods({
    doMsgDownBsTargetOutput: doMsgDownBsTargetOutput,
    doMsgDownBsTargetConfig: doMsgDownBsTargetConfig,
    doMsgDownBsTargetConfigNetwork: doMsgDownBsTargetConfigNetwork,
});
*/

var broker = "VyAVxfHye";

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

mqttClient = mqtt.connect('mqtt:123.57.208.39');
//mqttClient = mqtt.connect('mqtt:iot.eclipse.org');

mqttClient.on("connect", function() {
    console.log("connected mqtt broker");

    mqttClient.publish("presence", "hello from bsMonitor", function() {
        console.log("publish done");
    });

    mqttClient.subscribe("/up/#", function() {
        console.log("subscribe up done");
    });

    mqttClient.subscribe("$SYS/"+broker+"/new/clients", function() {
        console.log("subscribe client connected done");
    });

    mqttClient.subscribe("$SYS/"+broker+"/disconnect/clients", function() {
        console.log("subscribe client disconnected done");
    });

    mqttClient.on("message", onMsgMqtt);
});

onMsgMqtt = function(topicStr, message) {
    var topic = topicStr.split("/"); 
    //console.log(topic, message.toString());

    var tpKey = topic.shift();
    switch(tpKey) {
        case "$SYS":
            onMsgSys(topic, message);
            break;
        case "":
            onMsgMain(topic, message);
            break;
        default:
            console.log("unsupported topic key:", tpKey );
            return -1;
    } 
}

onMsgSys = function(topic, message) {
    var tpKey = topic.shift();
    if (tpKey === broker) {
        tpKey = topic.shift();
        switch(tpKey) {
            case "disconnect":
                var device = message.toString();
                console.log("client disconnected: ", device);
                var Fiber = Npm.require('fibers');
                Fiber(function() {
                    deviceProfileAll.collec.update({name:device}, {$set:{isOnline:false}});
                }).run();
                break;
            case "new":
                var device = message.toString();
                console.log("client connected: ", device);
                var Fiber = Npm.require('fibers');
                Fiber(function() {
                    deviceProfileAll.collec.update({name:device}, {$set:{isOnline:true}});
                }).run();
                break;
            default:
        }
    }
}

onMsgMain = function(topic, message) {
    var tpKey = topic.shift();
    switch(tpKey) {
        case "up":
            onMsgUp(topic, message);
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
        if (deviceProfileAll.collec.findOne({name: target}) !== undefined) {
            //console.log("message from:", target);
            deviceProfileAll.collec.update({name:target}, {$set:{isOnline:true}}); 
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
            console.log("unrecognized device:", target);
        }
    }).run();
}

onMsgUpBsTargetInput = function(target, topic, message) {
    var tpKey = topic.shift();
    var value = parseInt(message.toString());
    contactAll.collec.update({owner:target, localName:tpKey},
        {$set:{value:value}});
    //console.log("update input:", target, tpKey, value);
}

onMsgUpBsTargetOutput = function(target, topic, message) {
    var tpKey = topic.shift();
    contactAll.collec.update({owner:target, localName:tpKey},
        {$set:{value:message.toString()}});
    //console.log("update output:", target, tpKey, message);
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
        var config = getCurrentConfig(target);
        doMsgDown(topic, config);
    }).run();
}

doMsgDownBsTargetConfigNetwork = function(target) {
    var network = deviceProfileAll.collec.findOne({name:target});
    var config = "ssid:" + network.ssid + "," + "password:" + network.pwd;
    console.log("netowrk config:", config);
    var topic = "/down/bs/" + target + "/config";
    doMsgDown(topic, config);
}

contactAll = new contactBase(new Mongo.Collection("contacts"));
planAll = new PlanBase(new Mongo.Collection("plans"));
deviceProfileAll = new profileBase(new Mongo.Collection("deviceProfiles"));
userProfileAll = new profileBase(new Mongo.Collection("userProfiles"));

publishUserData = function(username) {
    Meteor.publish("users", function() {
        try {
            return Meteor.users.find({username:username});
        } catch(exception) {
            console.log(exception);
        }
    });

    Meteor.publish("userProfile", function() {
        try {
            console.log("publish userProfile @", username);
            return userProfileAll.collec.find({name:username});
        } catch(exception) {
            console.log(exception);
        }
    });

    Meteor.publish("deviceProfile", function() {
        try {
            var dl = userProfileAll.collec.findOne({name:username}).deviceList;
            console.log("publish deviceProfile @", username);
            return deviceProfileAll.collec.find({name:{ $in:dl}});
        } catch(exception) {
            console.log(exception);
        }
    });
}

publishDeviceData = function(devicename) {
    Meteor.publish("contact", function() {
        console.log("publish contact"); 
        try {
            console.log("currentDevice", devicename);
            console.log("publish contact @", devicename);
            return contactAll.collec.find({owner:devicename});
        } catch(exception) {
            console.log(exception);
        }
    });

    Meteor.publish("plan", function() {
        try {
            console.log("publish plan @", devicename);
            return planAll.collec.find({owner:devicename});
        } catch(exception) {
            console.log(exception);
        }
    });
}

subscribeUserData = function() {
    console.log("subscribe user data");
    Meteor.subscribe("users");
    Meteor.subscribe("deviceProfile");
    Meteor.subscribe("userProfile");
}

subscribeDeviceData = function() {
    console.log("subscribe device data");
    Meteor.subscribe("contact");
    Meteor.subscribe("plan");
}

contactAll = new contactBase(new Mongo.Collection("contacts"));
planAll = new PlanBase(new Mongo.Collection("plans"));
deviceProfileAll = new profileBase(new Mongo.Collection("deviceProfiles"));
userProfileAll = new profileBase(new Mongo.Collection("userProfiles"));

publishUserData = function(username) {
    console.log("publishUserData of", username);
    Meteor.publish("users@"+username, function() {
        try {
            console.log("publish users@", username);
            return Meteor.users.find({username:username});
        } catch(exception) {
            console.log(exception);
        }
    });

    Meteor.publish("userProfile@"+username, function() {
        try {
            console.log("publish userProfile@", username);
            return userProfileAll.collec.find({name:username});
        } catch(exception) {
            console.log(exception);
        }
    });

    Meteor.publish("deviceProfile@"+username, function() {
        try {
            var dl = userProfileAll.collec.findOne({name:username}).deviceList;
            console.log("publish deviceProfile@", username);
            return deviceProfileAll.collec.find({name:{ $in:dl}});
        } catch(exception) {
            console.log(exception);
        }
    });
}

publishDeviceData = function(devicename) {
    Meteor.publish("deviceProfile@"+devicename, function() {
        try {
            console.log("publish deviceProfile@", devicename);
            return deviceProfileAll.collec.find({name:devicename});
        } catch(exception) {
            console.log(exception);
        }
    });

    Meteor.publish("contact@"+devicename, function() {
        try {
            console.log("publish contact@", devicename);
            return contactAll.collec.find({owner:devicename});
        } catch(exception) {
            console.log(exception);
        }
    });

    Meteor.publish("plan@"+devicename, function() {
        try {
            console.log("publish plan@", devicename);
            return planAll.collec.find({owner:devicename});
        } catch(exception) {
            console.log(exception);
        }
    });
}


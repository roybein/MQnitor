contactAll = new contactBase(new Mongo.Collection("contacts"));
planAll = new PlanBase(new Mongo.Collection("plans"));
deviceProfileAll = new deviceProfileBase(new Mongo.Collection("deviceProfiles"));

if (Meteor.isClient) {
    console.log("subscribe");
    Meteor.subscribe("users");
    Meteor.subscribe("contact");
    Meteor.subscribe("plan");
    Meteor.subscribe("deviceProfile");
}

if (Meteor.isServer) {
    Meteor.publish("users", function() {
        try {
            return Meteor.users.find({_id:this.userId});
        } catch(exception) {
            console.log("E: unknow userId:", this.userId);
        }
    });

    Meteor.publish("contact", function() {
        try {
            var user = Meteor.users.findOne({_id:this.userId});
            console.log("publish contact @ ", user.username);
            return contactAll.collec.find({owner:user.username});
        } catch(exception) {
            console.log("E: unknow userId:", this.userId);
        }
    });

    Meteor.publish("plan", function() {
        try {
            var user = Meteor.users.findOne({_id:this.userId});
            console.log("publish plan @ ", user.username);
            return planAll.collec.find({owner:user.username});
        } catch(exception) {
            console.log("E: unknow userId:", this.userId);
        }
    });

    Meteor.publish("deviceProfile", function() {
        try {
            var user = Meteor.users.findOne({_id:this.userId});
            console.log("publish deviceProfile @ ", user.username);
            return deviceProfileAll.collec.find({owner:user.username});
        } catch(exception) {
            console.log("E: unknow userId:", this.userId);
        }
    });
}

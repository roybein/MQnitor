getAllDevOfCurrentUser = function() {
    try {
        return deviceProfileAll.collec.find({owner:currentUser()});
    } catch (exception) {
        console.log(exception);
    }
}

Template.manage.onCreated( function() {
    Meteor.call("publishUserData", currentUser());
    subscribeUserData(currentUser()); 
});

Template.manage.helpers({
    devices: function() {
        return getAllDevOfCurrentUser();
    },
});

Template.manage.events({
    'click #addDevice': function(event, template) {
        console.log("addDevice");
        var device = {name:"", alias:"", isOnline:false};
        Session.set("oneDevice", EJSON.toJSONValue(device));
        $('#oneDeviceModal')
            .modal('show');
    },
});

Template.device.events({
    'click #device': function(event, template) {
        //Session.set("currentDevice", this.name);
        console.log("go to monitor @", this.name);
        Router.go("monitor", {_id:this.name});
    },
});

Template.oneDevice.helpers({
    oneDevice: function() {
        var device = EJSON.fromJSONValue(Session.get("oneDevice"));
        if (device != null) {
            console.log("return oneDevice in helpers:", device);
            return device;
        } else {
            return null;
        }
    }
});

Template.oneDevice.events({
    "click #saveDevice": function(event, template) {
        var device = EJSON.fromJSONValue(Session.get("oneDevice"));
        var d = deviceProfileAll.getProfile(device.name);
        if (typeof(d) === "undefined") {
            deviceProfileAll.addProfile(device);
            //TODO: add device data
            var d = deviceProfileAll.getProfile(device.name);
            d.owner = currentUser();
            deviceProfileAll.updateProfile(d);

            console.log(d.name, "has been owned by", currentUser());

            $('#oneDeviceModal')
                .modal('hide');
            return false;
        } else {
            console.log("the device", device.name,
                " has been added by someone, can not be added twice");
            //TODO: notify
        }
    },

    "change #uuid": function(event, template) {
        var device = EJSON.fromJSONValue(Session.get("oneDevice"));
        device.name = event.target.value;
        console.log(device);
        Session.set("oneDevice", EJSON.toJSONValue(device));
    },

    "change #name": function(event, template) {
        var device = EJSON.fromJSONValue(Session.get("oneDevice"));
        device.alias = event.target.value;
        console.log(device);
        Session.set("oneDevice", EJSON.toJSONValue(device));
    },
    
});

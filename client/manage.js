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
        var device = {owner:"", name:"", alias:"", isOnline:false};
        Session.set("oneDevice", EJSON.toJSONValue(device));
        $('#oneDeviceModal')
            .modal('show');
    },
});

Template.device.events({
    'click #device': function(event, template) {
        console.log("go to monitor @", this.name);
        Router.go("monitor", {_id:this.name});
    },
    'click #editDevice': function(event, template) {
        console.log("edit device", this.name);
        var p = deviceProfileAll.getProfile(this.name);
        console.log("edit profile:", p);
        Session.set("oneDevice", EJSON.toJSONValue(p));
        $('#oneDeviceModal')
            .modal({observeChanges: true});
        $('#oneDeviceModal')
            .modal('show');
        
    },
    'click #delDevice': function(event, template) {
        console.log("delete device", this.name);
        deviceProfileAll.delProfile(this.name);
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
            device.owner = currentUser();
            deviceProfileAll.updateProfile(device);

            console.log(d.name, "has been owned by", currentUser());

            $('#oneDeviceModal').modal('hide');
            return false;
        } else {
            if(d.owner == currentUser()) {
                console.log("want to update", device);
                deviceProfileAll.updateProfile(device); 
                $('#oneDeviceModal').modal('hide');
                return false;
            } else {
                console.log("the device", device.name,
                    " has been added by someone, can not be added twice");
                //TODO: notify
            }
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

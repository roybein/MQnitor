getAllDevOfCurrentUser = function() {
    try {
        return deviceProfileAll.collec.find({owner:currentUser()});
    } catch (exception) {
        console.log(exception);
    }
}

updateDevice = function(device) {
    deviceProfileAll.updaateProfile(device);
}

addDevice = function(device) {
    deviceProfileAll.addProfile(device);
    addAllContact(device.name);
}

addAllContact = function(owner) {  
    var AI1 = {owner:owner, localId:1, localName:"AI1", direction:"input", port:"analog", type:"adc", name:"analog input 1", unit:"", value:null, description:"an analog input", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(AI1);
    
    var AI2 = {owner:owner, localId:2, localName:"AI2", direction:"input", port:"analog", type:"adc", name:"analog input 2", unit:"", value:null, description:"an analog input", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(AI2);
    
    var AI3 = {owner:owner, localId:3, localName:"AI3", direction:"input", port:"analog", type:"adc", name:"analog input 3", unit:"", value:null, description:"an analog input", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(AI3);
    
    var AI4 = {owner:owner, localId:4, localName:"AI4", direction:"input", port:"analog", type:"adc", name:"analog input 4", unit:"", value:null, description:"an analog input", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(AI4);
    
    var DI1 = {owner:owner, localId:5, localName:"DI1", direction:"input", port:"digital", type:"switch", name:"digital input 1", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(DI1);
    
    var DI2 = {owner:owner, localId:6, localName:"DI2", direction:"input", port:"digital", type:"switch", name:"digital intput 2", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(DI2);
    
    var DI3 = {owner:owner, localId:7, localName:"DI3", direction:"input", port:"digital", type:"switch", name:"digital input 3", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(DI3);
    
    var DI4 = {owner:owner, localId:8, localName:"DI4", direction:"input", port:"digital", type:"switch", name:"digital input 4", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(DI4);
    
    var DI5 = {owner:owner, localId:9, localName:"DI5", direction:"input", port:"digital", type:"switch", name:"digital input 5", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(DI5);
    
    var DI6 = {owner:owner, localId:10, localName:"DI6", direction:"input", port:"digital", type:"switch", name:"digital input 6", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(DI6);
    
    var RELAY1 = {owner:owner, localId:11, localName:"RELAY1", direction:"output", port:"relay", type:"relay", name:"relay 1", value:{value:"off"}, description:"a relay", planId:null, planSwitch:"disabled"};
    contactAll.addContact(RELAY1);

    var RELAY2 = {owner:owner, localId:12, localName:"RELAY2", direction:"output", port:"relay", type:"relay", name:"relay 2", value:{value:"off"}, description:"a relay", planId:null, planSwitch:"disabled"};
    contactAll.addContact(RELAY2);

    var RELAY3 = {owner:owner, localId:13, localName:"RELAY3", direction:"output", port:"relay", type:"relay", name:"relay 3", value:{value:"off"}, description:"a relay", planId:null, planSwitch:"disabled"};
    contactAll.addContact(RELAY3);

    var RELAY4 = {owner:owner, localId:14, localName:"RELAY4", direction:"output", port:"relay", type:"relay", name:"relay 4", value:{value:"off"}, description:"a relay", planId:null, planSwitch:"disabled"};
    contactAll.addContact(RELAY4);

    var RELAY5 = {owner:owner, localId:15, localName:"RELAY5", direction:"output", port:"relay", type:"relay", name:"relay 5", value:{value:"off"}, description:"a relay", planId:null, planSwitch:"disabled"};
    contactAll.addContact(RELAY5);

    var RELAY6 = {owner:owner, localId:16, localName:"RELAY6", direction:"output", port:"relay", type:"relay", name:"relay 6", value:{value:"off"}, description:"a relay", planId:null, planSwitch:"disabled"};
    contactAll.addContact(RELAY6);
    
    var PWM1 = {owner:owner, localId:17, localName:"PWM1", direction:"output", port:"pwm", type:"pwm", name:"pwm 1", value:{value:"off", pwmFreq:"0", pwmDuty:"50"}, description:"a pwm output", planId:null, planSwitch:"disabled"}
    contactAll.addContact(PWM1);

    var PWM2 = {owner:owner, localId:18, localName:"PWM2", direction:"output", port:"pwm", type:"pwm", name:"pwm 2", value:{value:"off", pwmFreq:"0", pwmDuty:"50"}, description:"a pwm output", planId:null, planSwitch:"disabled"}
    contactAll.addContact(PWM2);
    
    var email = {owner:owner, localId:19, localName:"email", direction:"output", type:"email", name:"email", planId:null};
    contactAll.addContact(email);
    
    var time = {owner:owner, localId:20, localName:"time", direction:"input", type:"time", name:"localTime", planIdGroup:[], lock:"unlocked"};
    contactAll.addContact(time);
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
        //TODO: delete device data
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
        if (device.owner == "") {
            device.owner = currentUser();
            addDevice(device);
            $('#oneDeviceModal').modal('hide');
            return false;
        } else if (device.owner == currentUser()) {
            updateDevice(device);
            $('#oneDeviceModal').modal('hide');
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

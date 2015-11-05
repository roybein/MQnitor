getAllDevOfCurrentUser = function() {
    try {
        console.log(currentUser());
        var dl = userProfileAll.collec.findOne({name:currentUser()}).deviceList;
        var devices = [];
        dl.forEach( function( elem, index, array) {
            var d = deviceProfileAll.collec.findOne({name:elem});
            if (d !== "undefined") {
                devices.push(d);
            } else {
                console.log("can't find device:", elem);
            }
        });
        console.log("got all devices @", currentUser(), devices);
        return devices;
    } catch (exception) {
        console.log(exception);
    }
}

Template.manage.helpers({
    devices: function() {
        return getAllDevOfCurrentUser();
    },
});

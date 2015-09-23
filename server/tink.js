setInterval(function() {
    var Fiber = Npm.require("fibers");
    Fiber(function() {
        var date = new Date();
        console.log("tick: ", date);
        var hour = date.getHours();
        if (hour > 12) {
           var time = (hour % 12).toString() + ":" + date.getMinutes() + " " + "PM";
        } else {
           var time = hour.toString() + ":" + date.getMinutes() + " " + "AM";
        }
        var day = date.getDay();
        contactAll.collec.update({localName:"timeShadow"},
            {$set:{time:time, weekday:day}} );
    }).run();
}, 5000);

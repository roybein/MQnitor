profileBase = function(collection) {
    this.collec = collection;
}

profileBase.prototype.addProfile = function(profile) {
    var p = this.collec.findOne({name:profile.name});
    if (typeof(p) === "undefined") {
        console.log("add profile:", profile);
        this.collec.insert(profile);
    } else {
        console.log("Ignore add profile exist");
    }
}

profileBase.prototype.updateProfile = function(profile) {
    var p = this.collec.findOne({name:profile.name});
    if (p != null) {
        console.log("update profile:", profile);
        this.collec.update({_id:p._id}, profile, {upsert:false});
    }; 
}

profileBase.prototype.getProfile = function(name) {
    return this.collec.findOne({name:name});
}

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
    var p = this.collec.findOne({owner:profile.owner});
    if (p != null) {
        console.log("update profile:", profile);
        this.collec.update({_id:c._id}, profile, {upsert:false});
    }; 
}

profileBase.prototype.getProfile = function(owner) {
    return this.collec.findOne({owner:owner});
}

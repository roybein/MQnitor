deviceProfileBase = function(collection) {
    this.collec = collection;
}

deviceProfileBase.prototype.addProfile = function(deviceProfile) {
    var p = this.collec.findOne({owner:deviceProfile.owner});
    if (typeof(p) === "undefined") {
        console.log("add deviceProfile:", deviceProfile);
        this.collec.insert(deviceProfile);
    }
}

deviceProfileBase.prototype.updateProfile = function(deviceProfile) {
    var p = this.collec.findOne({owner:deviceProfile.owner});
    if (p != null) {
        console.log("update deviceProfile:", deviceProfile);
        this.collec.update({_id:c._id}, deviceProfile, {upsert:false});
    }; 
}

deviceProfileBase.prototype.getProfile = function(owner) {
    return this.collec.findOne({owner:owner});
}

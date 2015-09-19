contactBase = function(collection) {
    this.collec = collection;
}

contactBase.prototype.addContact = function(contact) {
    var c = this.collec.findOne({owner:contact.owner, localName:contact.localName});
    if (typeof(c) !== "undefined") {
        //console.log("update contact:", contact);
        this.collec.update({_id:c._id}, contact, {upsert:true});
    } else {
        //console.log("insert contact", contact);
        this.collec.insert(contact);
    }
}

contactBase.prototype.getContact = function(owner, index) {
    return this.collec.findOne({owner:owner, localName:index});
}


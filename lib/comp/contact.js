contactBase = function(collection) {
    this.collec = collection;
}

contactBase.prototype.addContact = function(contact) {
    var c = this.collec.findOne({owner:contact.owner, localName:contact.localName});
    if (typeof(c) === "undefined") {
        this.collec.insert(contact);
    }
}

contactBase.prototype.updateContact = function(contact) {
    console.log("update contact:", contact);
    var c = this.collec.findOne({owner:contact.owner, localName:contact.localName});
    if (c != null) {
        this.collec.update({_id:c._id}, contact, {upsert:false});
    }; 
}

contactBase.prototype.getContact = function(owner, index) {
    return this.collec.findOne({owner:owner, localName:index});
}

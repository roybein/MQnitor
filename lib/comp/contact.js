contactBase = function(collection) {
    this.collec = collection;
}

contactBase.prototype.addContact = function(contact) {
    console.log("add contact:", contact);
    this.collec.update({_id:contact._id}, contact, {upsert:true});
}

contactBase.prototype.getContact = function(index) {
    return this.collec.findOne({_id:index});
}

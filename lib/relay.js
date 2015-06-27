Relay = function(collection, index, name, status, plan) {
        if (collection.findOne({index:index})) {
            console.log("Relay of index:", index, " exist already");
        } else {
            collection.insert({index:index, name:name, status:status, plan:plan});
        }
}


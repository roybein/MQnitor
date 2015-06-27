Sensor = function(collection, index, name, unit, value, description) {
        if (collection.findOne({index:index})) {
            console.log("Sensor of index:", index, " exist already");
        } else {
            collection.insert({index:index, name:name, unit:unit, value:value, description:description});
        }
}

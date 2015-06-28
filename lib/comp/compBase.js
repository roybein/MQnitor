SensorBase = function(collection) {
    this.collec = collection;
}

SensorBase.prototype.addSensor = function(sensor) {
    console.log("add sensor:", sensor);
    this.collec.update({_id:sensor.index}, {_id:sensor.index, name:sensor.name, unit:sensor.unit, value:sensor.value, description:sensor.description}, {upsert:true});
}

RelayBase = function(collection) {
    this.collec = collection;
}

RelayBase.prototype.addRelay = function(relay) {
    console.log("add relay:", relay);
    this.collec.update({_id:relay.index}, {_id:relay.index, name:relay.name, value:relay.value, description:relay.description, planId:relay.planId}, {upsert:true});
}


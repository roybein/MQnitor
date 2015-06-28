SensorBase = function(collection) {
    this.collec = collection;
}

SensorBase.prototype.addSensor = function(sensor) {
    console.log("add sensor:", sensor);
    this.collec.update({_id:sensor.index}, {_id:sensor.index, name:sensor.name, unit:sensor.unit, value:sensor.value, description:sensor.description, planIdGroup:sensor.planIndexGroup}, {upsert:true});
}

SensorBase.prototype.getSensor = function(index) {
    return this.collec.findOne({_id:index});
}

RelayBase = function(collection) {
    this.collec = collection;
}

RelayBase.prototype.addRelay = function(relay) {
    console.log("add relay:", relay);
    this.collec.update({_id:relay.index}, {_id:relay.index, name:relay.name, value:relay.value, description:relay.description, planId:relay.planId, planVal:relay.planVal}, {upsert:true});
}

RelayBase.prototype.getRelay = function(index) {
    return this.collec.findOne({_id:index});
}

PlanBase = function(collection) {
    this.collec = collection;
};

PlanBase.prototype.addPlan = function(plan) {
    console.log("add plan:", plan);
    this.collec.update({_id:plan.index}, {_id:plan.index, name:plan.name, relayId:plan.relayIndex, judgeGroup: plan.judgeGroup}, {upsert:true});
}

PlanBase.prototype.getPlan = function(index) {
   return this.collec.findOne({_id:index});
}

PlanBase.prototype.attachPlan = function(sensorBase, relayBase, relayIndex, planValue, planIndex) {
    relayBase.collec.update({_id:relayIndex}, {$set:{planId:planIndex, planVal:planValue}});
    var jg = this.collec.findOne({_id:planIndex}).judgeGroup; 
    jg.forEach( function(elem, index, group) {
        var pIdG = sensorBase.collec.findOne({_id:elem.sensorIndex}).planIdGroup;
        pIdG.push(elem.sensorIndex);
        sensorBase.collec.update({_id:elem.sensorIndex}, {$set:{planIdGroup:pIdG}}, {upsert:true});
    });
}

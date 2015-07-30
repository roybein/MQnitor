SensorBase = function(collection) {
    this.collec = collection;
}

SensorBase.prototype.addSensor = function(sensor) {
    console.log("add sensor:", sensor);
    this.collec.update({_id:sensor.index},
        {_id:sensor.index, name:sensor.name, unit:sensor.unit,
        value:sensor.value, description:sensor.description,
        planIdGroup:sensor.planIndexGroup}, {upsert:true});
}

SensorBase.prototype.getSensor = function(index) {
    return this.collec.findOne({_id:index});
}

RelayBase = function(collection) {
    this.collec = collection;
}

RelayBase.prototype.addRelay = function(relay) {
    console.log("add relay:", relay);
    this.collec.update({_id:relay.index},
        {_id:relay.index, name:relay.name, value:relay.value,
        description:relay.description, planId:relay.planId}, {upsert:true});
}

RelayBase.prototype.getRelay = function(index) {
    return this.collec.findOne({_id:index});
}

PlanBase = function(collection) {
    this.collec = collection;
};

PlanBase.prototype.addPlan = function(plan) {
    //if(plan.index != "new" && plan.index != "0") {
    //    plan.index = this.collec.find().count().toString();
    //}
    console.log("add plan:", plan);
    this.collec.update({_id:plan.index},
        {_id:plan.index, name:plan.name, relayIndex:plan.relayIndex,
        relayValue:plan.relayValue, judgeGroup: plan.judgeGroup}, {upsert:true});
    if (plan.relayIndex != null) {
        this.attachPlan(plan.relayIndex, plan.index);
    }
}

PlanBase.prototype.delPlan = function(index) {
    this.dettachPlan(index);
    this.collec.remove({_id:index});
    this.collec.find().forEach( function(elem, index, group) {
        if(elem._id > index) {
            elem._id--;
        }
    });
}

PlanBase.prototype.getPlan = function(index) {
    var planDb = this.collec.findOne({_id:index});
    if (typeof planDb != "undefined") {
        var plan = new Plan(planDb._id, planDb.name, planDb.relayIndex,
            planDb.relayValue, planDb.judgeGroup); 
        return plan;
    } else {
        return null;
    }
}

PlanBase.prototype.updatePlan = function(plan) {
    console.log("update plan:", plan);
    this.collec.update({_id:plan.index},
        {_id:plan.index, name:plan.name, relayIndex:plan.relayIndex,
        relayValue:plan.relayValue, judgeGroup: plan.judgeGroup}, {upsert:false});
}

PlanBase.prototype.attachPlan = function(relayIndex, planIndex) {
    relayAll.collec.update({_id:relayIndex}, {$set:{planId:planIndex}});
    var jg = this.collec.findOne({_id:planIndex}).judgeGroup; 
    jg.forEach( function(elem, index, group) {
        var pIdG = sensorAll.collec.findOne({_id:elem.sensorIndex}).planIdGroup;
        pIdG.push(planIndex);
        sensorAll.collec.update({_id:elem.sensorIndex}, {$set:{planIdGroup:pIdG}}, {upsert:true});
    });
}

PlanBase.prototype.dettachPlan = function(planIndex) {
    var relayIndex = this.collec.findOne({_id:planIndex}).relayIndex;
    relayAll.collec.update({_id:relayIndex}, {$set:{planId:null}});
    var jg = this.collec.findOne({_id:planIndex}).judgeGroup; 
    jg.forEach( function(elem, index, group) {
        var sensor = sensorAll.collec.findOne({_id:elem.sensorIndex});
        if (typeof sensor != "undefined") {
            var pIdG = sensor.planIdGroup;
            pIdG.splice(planIndex, 1);
            sensorAll.collec.update({_id:elem.sensorIndex}, {$set:{planIdGroup:pIdG}}, {upsert:true});
        }
    });
}

PlanBase.prototype.checkPlan = function(planIndex) {
    console.log("check plan of index:", planIndex);
    var plan = this.getPlan(planIndex);
    //console.log(plan);
    plan.check();
}


PlanBase = function(collection) {
    this.collec = collection;
};

PlanBase.prototype.addPlan = function(plan) {
    console.log("add plan:", plan);
    this.collec.update({_id:plan._id}, plan, {upsert:true});
}

PlanBase.prototype.delPlan = function(index) {
    this.detachPlan(index);
    this.collec.remove({_id:index});
    this.collec.find().forEach( function(elem, index, group) {
        if(elem._id > index) {
            elem._id--;
        }
    });
}

addJudgeElem = function(plan, judgeElem) {
    plan.judgeGroup.push(judgeElem);
    return plan;
}

delJudgeElem = function(plan, judgeElemIndex) {
    plan.judgeGroup.splice(judgeElemIndex, 1);
    plan.judgeGroup.forEach( function(elem, index, group) {
        elem.index = index;
    });
    return plan;
}

PlanBase.prototype.getPlan = function(index) {
    return this.collec.findOne({_id:index});
}

PlanBase.prototype.updatePlan = function(plan) {
    console.log("update plan:", plan);
    this.collec.update({_id:plan._id}, plan, {upsert:false});
}

PlanBase.prototype.attachPlan = function(planIndex) {
    var plan = this.collec.findOne({_id:planIndex});
    console.log("attach plan: ", planIndex, " to output: ", plan.outputId);
    contactAll.collec.update({_id:plan.outputId}, {$set:{planId:planIndex}});
    var jg = this.collec.findOne({_id:planIndex}).judgeGroup;
    jg.forEach( function(elem, index, group) {
        var pIdG = contactAll.collec.findOne({_id:elem.inputId}).planIdGroup;
        pIdG.push(planIndex);
        contactAll.collec.update({_id:elem.inputId}, {$set:{planIdGroup:pIdG}}, {upsert:true});
    });
}

PlanBase.prototype.detachPlan = function(planIndex) {
    console.log("detach plan: ", planIndex);
    var outputId = this.collec.findOne({_id:planIndex}).outputId;
    contactAll.collec.update({_id:outputId}, {$set:{planId:null}});
    var jg = this.collec.findOne({_id:planIndex}).judgeGroup;
    jg.forEach( function(elem, index, group) {
        var input = contactAll.collec.findOne({_id:elem.inputId});
        if (typeof input != "undefined") {
            var pIdG = input.planIdGroup;
            pIdG.splice(pIdG.indexOf(planIndex), 1);
            contactAll.collec.update({_id:elem.inputId}, {$set:{planIdGroup:pIdG}}, {upsert:true});
        }
    });
}

PlanBase.prototype.checkPlan = function(planIndex) {
    console.log("check plan of index:", planIndex);
    var result = false;
    var logicValue = false;
    var plan = this.collec.findOne({_id:planIndex});
    plan.judgeGroup.forEach( function(elem, index, group) {
        var input = contactAll.collec.findOne({_id:elem.inputId});
        switch (input.type) {
            case "time":
                var timePlan = input.timeStart.split(/:| /);
                var timeValue = value.split(/:| /); 
/*
                if( (value >= elem.valueStart) && (value <= elem.valueEnd) ) {
                    logicValue = true;
                } else {
                    logicValue = false;
                }
*/
                break;
            case "weekday":
                var value = input.value;
                if(elem.yesDayGroup.indexOf(value) > -1) {
                    logicValue = true;
                } else {
                    logicValue = false;
                }
                break;
            case "adc":
            case "sensor":
            case "wire" :
                var value = input.value;
                if( (value >= elem.valueMin) && (value <= elem.valueMax) ) {
                    logicValue = true;
                } else {
                    logicValue = false;
                }
                break;
            case "counter":
                var value = input.value;
                if(value > elem.waterMark) {
                    logicValue = true;
                } else {
                    logicValue = false;
                }
                break;
            case "switch":
                var value = input.value;
                if(value == elem.trueValue) {
                    logicValue = true;
                } else {
                    logicValue = false;
                }
                break;
            default:
                console.log("unsupport input type: ", input.type);
        }

        switch (elem.logicOp) {
            case "root":
                result = logicValue;
                break;
            case "and":
                result = result && logicValue;
                break;
            case "or":
                result = result || logicType;
                break;
            case "not":
                result = result && !(logicValue);
                break;

            default:
                console.log("invalid logicOp:", elem.logicOp);
        }
    });

    console.log("check plan:", plan._id, " result=", result);
    if (result) {
        console.log("change output: ", plan.outputId, " value = ", plan.outputValue);
        contactAll.collec.update({_id:plan.outputId}, {$set:{value:plan.outputValue}});
    }
}

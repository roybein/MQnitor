PlanBase = function(collection) {
    this.collec = collection;
};

PlanBase.prototype.addPlan = function(plan) {
    console.log("add plan:", plan);
    var p = this.collec.findOne({owner:plan.owner, localId:plan.localId});
    if (typeof(p) != "undefined") {
        this.collec.update({_id:p._id}, plan, {upsert:true});
    } else {
        this.collec.insert(plan);
    }
}

PlanBase.prototype.delPlan = function(owner, index) {
    this.detachPlan(owner, index);
    this.collec.remove({owner:owner,localId:index});
    this.collec.find({owner:owner}).forEach( function(elem, index, group) {
        if(elem.localId > index) {
            elem.localId--;
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

PlanBase.prototype.getPlan = function(owner, index) {
    return this.collec.findOne({owner:owner, localId:index});
}

PlanBase.prototype.updatePlan = function(plan) {
    console.log("update plan:", plan);
    var p = this.collec.findOne({owner:plan.owner, localId:plan.localId});
    if (p != null) {
        this.collec.update({_id:p._id}, plan, {upsert:false});
    };
}

PlanBase.prototype.attachPlan = function(owner, planIndex) {
    var plan = this.collec.findOne({owner:owner, localId:planIndex});
    console.log("attach plan: ", planIndex, " to output: ", plan.outputId);
    var o = contactAll.collec.findOne({owner:owner, localId:plan.outputId});
    if (typeof(o) === "undefined") {
        return;
    }
    contactAll.collec.update({_id:o._id}, {$set:{planId:plan.localId}});
    var jg = this.collec.findOne({owner:owner, localId:planIndex}).judgeGroup;

    jg.forEach( function(elem, index, group) {
        var pIdG = contactAll.collec.findOne({owner:owner, localId:elem.inputId}).planIdGroup;
        pIdG.push(planIndex);
        var i = contactAll.collec.findOne({owner:owner, localId:elem.inputId});
        if (typeof(i) === "undefined") {
            return;
        }
        contactAll.collec.update({_id:i._id}, {$set:{planIdGroup:pIdG}}, {upsert:true});
    });
}

PlanBase.prototype.detachPlan = function(owner, planIndex) {
    console.log("detach plan: ", planIndex);
    var p = this.collec.findOne({owner:owner, localId:planIndex});

    var o = contactAll.collec.findOne({owner:owner, localId:p.outputId});
    contactAll.collec.update({_id:o._id}, {$set:{planId:null}});

    var jg = p.judgeGroup;
    jg.forEach( function(elem, index, group) {
        var i = contactAll.collec.findOne({owner:owner, localId:elem.inputId});
        if (typeof i != "undefined") {
            var pIdG = i.planIdGroup;
            pIdG.splice(pIdG.indexOf(planIndex), 1);
            contactAll.collec.update({_id:i._id}, {$set:{planIdGroup:pIdG}}, {upsert:true});
        }
    });
}

PlanBase.prototype.checkPlan = function(owner, planIndex) {
    console.log("check plan:", owner, planIndex);

    var result = true;
    var logicValue = false;
    var plan = this.collec.findOne({owner:owner, localId:planIndex});

    var output = contactAll.collec.findOne({owner:plan.owner, localId:plan.outputId});
    if (output.planSwitch === "disabled") {
        console.log("output:", output.localId, " planSwitch is disabled");
        return null;
    }

    plan.judgeGroup.forEach( function(elem, index, group) {
        var input = contactAll.collec.findOne({owner:plan.owner, localId:elem.inputId});
        switch (input.type) {
            case "time":
                var timeStartData = elem.timeStart.split(/:| /);
                var timeEndData = elem.timeEnd.split(/:| /);
                var timeValueData = input.time.split(/:| /);

                var timeStart = (timeStartData[0] % 12 * 60) +
                        timeStartData[1];
                if(timeStartData[2] === "PM") {
                    timeStart += 12 * 60;
                }
                console.log("timeStart=", timeStart);

                var timeEnd = (timeEndData[0] % 12 * 60) +
                        timeEndData[1];
                if(timeEndData[2] === "PM") {
                    timeEnd += 12 * 60;
                }
                console.log("timeEnd=", timeEnd);

                var timeValue = (timeValueData[0] % 12 * 60) +
                        timeValueData[1];
                if(timeValueData[2] === "PM") {
                    timeValue += 12 * 60;
                }
                console.log("timeValue=", timeValue);

                var weekday = input.weekday;
                console.log("weekday=", weekday);

                var repeatDays = elem.repeatDays;
                console.log("repeatDays=", repeatDays);

                console.log(repeatDays.indexOf(weekday));

                if( (repeatDays.indexOf(weekday) > -1) &&
                    (timeValue >= timeStart) &&
                    (timeValue <= timeEnd) ) {
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
                console.log("input value=", value);
                console.log("trueValue=", elem.valueTrue);
                if(value == elem.valueTrue) {
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
                result = result || logicValue;
                break;
            case "not":
                result = result && !(logicValue);
                break;

            default:
                console.log("invalid logicOp:", elem.logicOp);
        }
        console.log("update result=", result);
    });

    console.log("check plan:", plan.localId, " result=", result);
    if (result) {
        console.log("change output: ", plan.outputId, " value = ", plan.outputValue);
        contactAll.collec.update({owner:plan.owner, localId:plan.outputId}, {$set:{value:plan.outputValue}});
    }
}

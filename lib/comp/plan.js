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
    var result = true;
    var logicValue = false;
    var plan = this.collec.findOne({_id:planIndex});

    var output = contactAll.collec.findOne({_id:plan.outputId});
    if (output.planSwitch === "disabled") {
        console.log("output:", output._id, " planSwitch is disabled");
        return null;
    }

    console.log("check plan of index:", planIndex);
    plan.judgeGroup.forEach( function(elem, index, group) {
        var input = contactAll.collec.findOne({_id:elem.inputId});
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

    console.log("check plan:", plan._id, " result=", result);
    if (result) {
        console.log("change output: ", plan.outputId, " value = ", plan.outputValue);
        contactAll.collec.update({_id:plan.outputId}, {$set:{value:plan.outputValue}});
    }
}

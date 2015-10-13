PlanBase = function(collection) {
    this.collec = collection;
};

PlanBase.prototype.addPlan = function(plan) {
    console.log("add plan:", plan);
    var p = this.collec.findOne({owner:plan.owner, localName:plan.localName});
    if (typeof(p) != "undefined") {
        this.collec.update({_id:p._id}, plan, {upsert:true});
    } else {
        this.collec.insert(plan);
    }
}

PlanBase.prototype.delPlan = function(owner, index) {
    var plan = this.getPlan(owner, index);
    this.detachPlan(owner, index);
    this.collec.remove({_id:plan._id});
    this.collec.find({owner:owner}).forEach( function(elem, index, group) {
        if(elem.localName > index) {
            elem.localName--;
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
    return this.collec.findOne({owner:owner, localName:index});
}

PlanBase.prototype.updatePlan = function(plan) {
    console.log("update plan:", plan);
    var p = this.collec.findOne({owner:plan.owner, localName:plan.localName});
    if (p != null) {
        this.collec.update({_id:p._id}, plan, {upsert:false});
    };
}

PlanBase.prototype.attachPlan = function(owner, planIndex) {
    var plan = this.collec.findOne({owner:owner, localName:planIndex});
    console.log("attach plan: ", planIndex, " to output: ", plan.outputId);
    var o = contactAll.collec.findOne({owner:owner, localName:plan.outputId});
    if (typeof(o) === "undefined") {
        return;
    }
    contactAll.collec.update({_id:o._id}, {$set:{planId:plan.localName}});
    var jg = this.collec.findOne({owner:owner, localName:planIndex}).judgeGroup;

    jg.forEach( function(elem, index, group) {
        var i = contactAll.collec.findOne({owner:owner, localName:elem.inputId});
        if (typeof(i) === "undefined") {
            return;
        }
        var pIdG = i.planIdGroup;
        if (pIdG.indexOf(planIndex) == -1) {
            pIdG.push(planIndex);
            contactAll.collec.update({_id:i._id}, {$set:{planIdGroup:pIdG}}, {upsert:true});
        }
    });
}

PlanBase.prototype.detachPlan = function(owner, planIndex) {
    console.log("detach plan: ", planIndex);
    var p = this.collec.findOne({owner:owner, localName:planIndex});

    var o = contactAll.collec.findOne({owner:owner, localName:p.outputId});
    contactAll.collec.update({_id:o._id}, {$set:{planId:null}});

    var jg = p.judgeGroup;
    jg.forEach( function(elem, index, group) {
        var i = contactAll.collec.findOne({owner:owner, localName:elem.inputId});
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
    var plan = this.collec.findOne({owner:owner, localName:planIndex});

    var output = contactAll.collec.findOne({owner:plan.owner, localName:plan.outputId});
    if (output.planSwitch === "disabled") {
        console.log("output:", output.localName, " plan is disabled");
        return null;
    }

    plan.judgeGroup.forEach( function(elem, index, group) {
        var input = contactAll.collec.findOne({owner:plan.owner, localName:elem.inputId});
        switch (input.type) {
            case "time":
                var timeStartData = elem.timeStart.split(/:| /);
                var timeEndData = elem.timeEnd.split(/:| /);
                var timeShadow = contactAll.collec.findOne({localName:"timeShadow"});
                var timeValueData = timeShadow.time.split(/:| /);

                var timeStart = (parseInt(timeStartData[0]) % 12 * 60) +
                                    parseInt(timeStartData[1]);
                if(timeStartData[2] === "PM") {
                    timeStart += 12 * 60;
                }
                //console.log("timeStart=", timeStart);

                var timeEnd = (parseInt(timeEndData[0]) % 12 * 60) +
                                parseInt(timeEndData[1]);
                if(timeEndData[2] === "PM") {
                    timeEnd += 12 * 60;
                }
                //console.log("timeEnd=", timeEnd);

                var timeValue = (parseInt(timeValueData[0]) % 12 * 60) +
                        parseInt(timeValueData[1]);
                if(timeValueData[2] === "PM") {
                    timeValue += 12 * 60;
                }
                //console.log("timeValue=", timeValue);

                var weekday = timeShadow.weekday;
                //console.log("weekday=", weekday);

                var repeatDays = elem.repeatDays;
                //console.log("repeatDays=", repeatDays);

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
                //console.log("input value=", value);
                if( (value >= elem.valueMin) && (value <= elem.valueMax) ) {
                    logicValue = true;
                } else {
                    logicValue = false;
                }
                break;
            case "counter":
                var value = input.value;
                //console.log("input value=", value);
                if(value > elem.waterMark) {
                    logicValue = true;
                } else {
                    logicValue = false;
                }
                break;
            case "switch":
                var value = input.value;
                //console.log("input value=", value);
                if(value == elem.valueTrue) {
                    logicValue = true;
                } else {
                    logicValue = false;
                }
                break;
            default:
                //console.log("unsupport input type: ", input.type);
        }

        switch (elem.logicOp) {
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
        //console.log("update result=", result);
    });

    console.log("check plan:", plan.localName, " result=", result);
    if (result) {
        console.log("change output: ", plan.outputId, " value = ", plan.outputValue);
        doMsgDownBsTargetOutput(plan.owner, plan.outputId, plan.outputValue);
        contactAll.collec.update({owner:plan.owner, localName:plan.outputId}, {$set:{value:plan.outputValue}});

        if (plan.sendEmail === true) {
            var e = plan.outputEmail;
            sendEmail(e.to, e.from, e.subject, e.text);
        }
    }
}

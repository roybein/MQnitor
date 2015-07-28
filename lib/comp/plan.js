JudgeElem = function(index, sensorIndex, yesMin, yesMax, logicValue, logicType) {
    this.index = index;
    this.sensorIndex = sensorIndex;
    this.yesMin = yesMin;
    this.yesMax = yesMax;
    this.logicValue = logicValue;
    this.logicType = logicType;
}

JudgeElem.prototype.typeName = function() {
    return "ejsonTypeJudgeElem";
}

JudgeElem.prototype.toJSONValue = function() {
    return {"index":this.index, "sensorIndex":this.sensorIndex, "yesMin":this.yesMin,
        "yesMax":this.yesMax, "logicValue":this.logicValue, "logicType":this.logicType}
}

EJSON.addType('ejsonTypeJudgeElem', function(jsonValue) {
    return new JudgeElem(jsonValue.index, jsonValue.sensorIndex, jsonValue.yesMin,
        jsonValue.yesMax, jsonValue.logicValue, jsonValue.logicType);
});

Plan = function(index, name, relayIndex, relayValue, judgeGroup) {
    this.index = index;
    this.name = name;
    this.relayIndex = relayIndex;
    this.relayValue = relayValue;
    this.judgeGroup = judgeGroup;
}

Plan.prototype.typeName = function() {
    return "ejsonTypePlan";
}

Plan.prototype.toJSONValue = function() {
    return {"index":this.index, "name":this.name, "relayIndex":this.relayIndex,
        "relayValue":this.relayValue, "judgeGroup":this.judgeGroup}
}

EJSON.addType('ejsonTypePlan', function(jsonValue) {
    return new Plan(jsonValue.index, jsonValue.name, jsonValue.relayIndex,
        jsonValue.relayValue, jsonValue.judgeGroup);
});

Plan.prototype.getJudgeElem = function(judgeElemIndex) {
    judgeElemDb = this.judgeGroup[judgeElemIndex];
    console.log("in getJudgeElem:", judgeElemDb);
    if (typeof judgeElemDb != "undefined") {
        var judgeElem = new JudgeElem(judgeElemDb.index, judgeElemDb.sensorIndex,
            judgeElemDb.yesMin, judgeElemDb.yesMax, judgeElemDb.logicValue, judgeElemDb.logicType);
        console.log("in getJudgeElem:", judgeElem);
        return judgeElem;
    } else {
        return null;
    }
}

Plan.prototype.addJudgeElem = function(judgeElem) {
    judgeElem.index = this.judgeGroup.length.toString();
    this.judgeGroup.push(judgeElem);
}

Plan.prototype.delJudgeElem = function(judgeElemIndex) {
    this.judgeGroup.splice(judgeElemIndex, 1);
    this.judgeGroup.forEach( function(elem, index, group) {
        elem.index = index;
    });
}

Plan.prototype.updateJudgeElem = function(judgeElem) {
    this.judgeGroup.splice(judgeElem.index, 1, judgeElem);
}

Plan.prototype.check = function() {
    var result = false;
    this.judgeGroup.forEach( function(elem, index, group) {
        var sensorValue = sensorAll.collec.findOne({_id:elem.sensorIndex}).value;
        if((sensorValue >= elem.yesMin) && (sensorValue <= elem.yesMax)) {
            elem.logicValue = true;
        } else {
            elem.logicValue = false;
        }
 
        switch(elem.logicType) {
            case "ori":
                result = elem.logicValue;
                break;
            case "and":
                result = result && elem.logicValue;
                break;
            case "or":
                result = result || elem.logicType;
                break;
            default:
                console.log("invalid logicType:", elem.logicType);
        }
    });
    console.log("check plan:", this.index, " result=", result);
    if(result) {
        console.log("change relay:", this.relayIndex, " value =", this.relayValue);
        relayAll.collec.update({_id:this.relayIndex}, {$set:{value:this.relayValue}});
    }
}


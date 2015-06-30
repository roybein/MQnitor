JudgeElem = function(index, sensorIndex, yesMin, yesMax, logicValue, logicType) {
    this.index = index;
    this.sensorIndex = sensorIndex;
    this.yesMin = yesMin;
    this.yesMax = yesMax;
    this.logicValue = logicValue;
    this.logicType = logicType;
}

Plan = function(index, name, relayIndex, relayValue, judgeGroup) {
    this.index = index;
    this.name = name;
    this.relayIndex = relayIndex;
    this.relayValue = relayValue;
    this.judgeGroup = judgeGroup;
}

Plan.prototype.addJudgeElem = function(judgeElem) {
    this.judgeGroup.push(judgeElem);
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


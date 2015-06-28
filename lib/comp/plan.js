JudgeElem = function(index, sensorIndex, yesMin, yesMax, logicValue, logicType) {
    this.index = index;
    this.sensorIndex = sensorIndex;
    this.yesMin = yesMin;
    this.yesMax = yesMax;
    this.logicValue = logicValue;
    this.logicType = logicType;
}

Plan = function(index, name, relayIndex, judgeGroup) {
    this.index = index;
    this.name = name;
    this.relayIndex = relayIndex;
    this.judgeGroup = judgeGroup;
}

Plan.prototype.addJudgeElem = function(judgeElem) {
    this.judgeGroup.push(judgeElem);
}


Plan.prototype.check = function() {
    var preResult = this.result;
    var result = false;
    this.judgeGroup.forEach( function(elem, index, group) {
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

    if(result === true) {
        //set relay to planValue
    }
}


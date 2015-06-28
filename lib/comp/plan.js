/*
Judge = function(collection, index, judgeMap) {
    this.collection = collection;
    this.index = index;
    if(collection.findOne({index:index})) { 
        console.log("judge of index:", index, " already exist");
    } else {
        collection.insert({index:index, judgeMap:judgeMap});
    }
}

Judge.prototype.addJudgeMap = function(index, judgeMap) {
    return this.collection.findOne

Judge.prototype.getJudgeMap = function() {
    return this.collection.findOne({index:this.index}).judgeMap;
}

JudgeMap.prototype.addElement = function(judgeElement) {
    jm = this.getJudgeMap();
    console.log("before", jm);
    foreach
    if (jm.indexOf(judgeElement) > -1) {
        console.log("judgeElement already exist");
    } else {
        jm.push(judgeElement);
    }
    console.log("after", jm);
    this.collection.update({index:this.index}, {$set:{judgeMap:jm}}); 
}

JudgeElement = function(index, sensorIndex, yesMin, yesMax, logicValue) {
    this.index = index;
    this.sensorIndex = sensorIndex;
    this.yesMin = yesMin;
    this.yesMax = yesMax;
    this.logicValue = logicValue;    
}
*/

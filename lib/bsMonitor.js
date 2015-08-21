
contactAll = new contactBase(new Mongo.Collection("contacts"));

var sensorLight = {_id:"AI1", direction:"input", type:"adc", name:"light", unit:"lux", value:777, description:"a light sensor", planIdGroup:[]};
contactAll.addContact(sensorLight);

var sensorTemperature = {_id:"DI1", direction:"input", type:"sensor", name:"temperature", unit:"C", value:30, description:"a temperature sensor", planIdGroup:[]};
contactAll.addContact(sensorTemperature);

var relayMasterPower = {_id:"DO1", direction:"output", type:"relay", name:"master power", value:"on", description:"switch master power", planId:null};
contactAll.addContact(relayMasterPower);

var pwmLight = {_id:"DO2", direction:"output", type:"pwm", name:"pwm light", value:"on", freq:"100Hz", duty:"50%", description:"switch master power", planId:null};
contactAll.addContact(pwmLight);

planAll = new PlanBase(new Mongo.Collection("plans"));

var planOnMasterPower = {_id:"0", name:"plan for master power", outputId:"DO1", outputValue:"off", judgeGroup:[]};
var judgeElem1 = {_id:"1", inputId:"AI1", valueMin:500, valueMax:600, logicOp:"root"};
var judgeElem2 = {_id:"2", inputId:"DI1", valueMin:20, valueMax:30, logicOp:"and"};
planOnMasterPower = addJudgeElem(planOnMasterPower, judgeElem1);
planOnMasterPower = addJudgeElem(planOnMasterPower, judgeElem2);

planAll.addPlan(planOnMasterPower);
planAll.attachPlan("0");

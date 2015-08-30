
contactAll = new contactBase(new Mongo.Collection("contacts"));

var sensorLight = {_id:"AI1", direction:"input", type:"adc", name:"light", unit:"lux", value:777, description:"a light sensor", planIdGroup:[]};
contactAll.addContact(sensorLight);

var sensorTemperature = {_id:"DI1", direction:"input", type:"sensor", name:"temperature", unit:"C", value:30, description:"a temperature sensor", planIdGroup:[]};
contactAll.addContact(sensorTemperature);

var counterPeople = {_id:"DI2", direction:"input", type:"counter", name:"people counter", unit:"", value:200, description:"a people counter", planIdGroup:[]};
contactAll.addContact(counterPeople);

var switchOpen = {_id:"DI3", direction:"input", type:"switch", name:"door open", unit:"", value:"on", description:"is door open", planIdGroup:[]};
contactAll.addContact(switchOpen);

var sensorTime = {_id:"time", direction:"input", type:"time", name:"localTime", time:"8:00 AM", weekday:"5", planIdGroup:[]};
contactAll.addContact(sensorTime);

var relayMasterPower = {_id:"DO1", direction:"output", type:"relay", name:"master power", value:"on", description:"switch master power", planId:null};
contactAll.addContact(relayMasterPower);

var pwmLight = {_id:"DO2", direction:"output", type:"pwm", name:"pwm light", value:"on", freq:"100Hz", duty:"50%", description:"switch master power", planId:null};
contactAll.addContact(pwmLight);

planAll = new PlanBase(new Mongo.Collection("plans"));

var planOnMasterPower = {_id:"0", name:"plan for master power", outputId:"DO2", outputValue:"off", judgeGroup:[]};
var judgeElem1 = {index:"0", inputId:"AI1", valueMin:500, valueMax:600, logicOp:"and"};
var judgeElem2 = {index:"1", inputId:"DI1", valueMin:20, valueMax:30, logicOp:"and"};
var judgeElem3 = {index:"2", inputId:"time", timeStart:"8:30 AM", timeEnd:"9:20 PM", repeatDays:[1,3,5,7], logicOp:"and"};
var judgeElem4 = {index:"3", inputId:"DI2", waterMark:100, logicOp:"and"};
var judgeElem5 = {index:"4", inputId:"DI3", valueTrue:"off", logicOp:"and"};
planOnMasterPower = addJudgeElem(planOnMasterPower, judgeElem1);
planOnMasterPower = addJudgeElem(planOnMasterPower, judgeElem2);
planOnMasterPower = addJudgeElem(planOnMasterPower, judgeElem3);
planOnMasterPower = addJudgeElem(planOnMasterPower, judgeElem4);
planOnMasterPower = addJudgeElem(planOnMasterPower, judgeElem5);

planAll.addPlan(planOnMasterPower);
planAll.attachPlan("0");

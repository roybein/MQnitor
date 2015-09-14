//Add Contacts For Test

var sensorLight = {owner:"test", localId:"AI1", direction:"input", type:"adc", name:"light", unit:"lux", value:550, description:"a light sensor", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(sensorLight);

var sensorTemperature = {owner:"test", localId:"DI1", direction:"input", type:"sensor", name:"temperature", unit:"C", value:30, description:"a temperature sensor", planIdGroup:[], lock:"locked"};
contactAll.addContact(sensorTemperature);

var counterPeople = {owner:"test", localId:"DI2", direction:"input", type:"counter", name:"people counter", unit:"", value:200, description:"a people counter", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(counterPeople);

var switchOpen = {owner:"test", localId:"DI3", direction:"input", type:"switch", name:"door open", unit:"", value:"on", description:"is door open", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(switchOpen);

var sensorTime = {owner:"test", localId:"time", direction:"input", type:"time", name:"localTime", time:"8:45 AM", weekday:5, planIdGroup:[], lock:"unlocked"};
contactAll.addContact(sensorTime);

var relayMasterPower = {owner:"test", localId:"DO1", direction:"output", type:"relay", name:"master power", value:"on", description:"switch master power", planId:null, planSwitch:"disabled"};
contactAll.addContact(relayMasterPower);

var pwmLight = {owner:"test", localId:"DO2", direction:"output", type:"pwm", name:"pwm light", value:"on", freq:"100Hz", duty:"50%", description:"switch master power", planId:null, planSwitch:"enabled"};
contactAll.addContact(pwmLight);


//Add Plan For Test
var planOnMasterPower = {owner:"test", localId:"0", name:"plan for master power", outputId:"DO1", outputValue:"off", judgeGroup:[]};
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
planAll.attachPlan("test", "0");

var planOnPwmLight = {owner:"test", localId:"1", name:"plan for pwm light", outputId:"DO2", outputValue:"on", judgeGroup:[]};
var judgeElem1 = {index:"0", inputId:"AI1", valueMin:500, valueMax:600, logicOp:"and"};
var judgeElem2 = {index:"1", inputId:"DI1", valueMin:20, valueMax:30, logicOp:"and"};
var judgeElem3 = {index:"2", inputId:"time", timeStart:"8:30 AM", timeEnd:"9:20 PM", repeatDays:[1,3,5,7], logicOp:"and"};
var judgeElem4 = {index:"3", inputId:"DI2", waterMark:100, logicOp:"and"};
var judgeElem5 = {index:"4", inputId:"DI3", valueTrue:"off", logicOp:"and"};
planOnPwmLight = addJudgeElem(planOnPwmLight, judgeElem1);
planOnPwmLight = addJudgeElem(planOnPwmLight, judgeElem2);
planOnPwmLight = addJudgeElem(planOnPwmLight, judgeElem3);
planOnPwmLight = addJudgeElem(planOnPwmLight, judgeElem4);
planOnPwmLight = addJudgeElem(planOnPwmLight, judgeElem5);
planAll.addPlan(planOnPwmLight);
planAll.attachPlan("test", "1");

var testConfig = {owner:"test", model:"br864",
    AI1:"adc", AI2:"adc", AI3:"adc", AI4:"adc",
    DI1:"switch", DI2:"switch", DI3:"switch", DI4:"switch", DI5:"switch", DI6:"switch",
    DO1:"relay", DO2:"relay", DO3:"relay", DO4:"relay", DO5:"relay", DO6:"relay",
    DO7:"pwm", DO8:"pwm"};

configAll.insert(testConfig);

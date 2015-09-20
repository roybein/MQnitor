//Add Contacts For Test
var AI1 = {owner:"864-test", localId:1, localName:"AI1", direction:"input", port:"analog", type:"adc", name:"light", unit:"lux", value:550, description:"a light sensor", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(AI1);

var AI2 = {owner:"864-test", localId:2, localName:"AI2", direction:"input", port:"analog", type:"adc", name:"light", unit:"lux", value:550, description:"a light sensor", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(AI2);

var AI3 = {owner:"864-test", localId:3, localName:"AI3", direction:"input", port:"analog", type:"adc", name:"light", unit:"lux", value:550, description:"a light sensor", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(AI3);

var AI4 = {owner:"864-test", localId:4, localName:"AI4", direction:"input", port:"analog", type:"adc", name:"light", unit:"lux", value:550, description:"a light sensor", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(AI4);

var DI1 = {owner:"864-test", localId:5, localName:"DI1", direction:"input", port:"digital", type:"sensor", name:"temperature", unit:"C", value:30, description:"a temperature sensor", planIdGroup:[], lock:"locked"};
contactAll.addContact(DI1);

var DI2 = {owner:"864-test", localId:6, localName:"DI2", direction:"input", port:"digital", type:"counter", name:"people counter", unit:"", value:200, description:"a people counter", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI2);

var DI3 = {owner:"864-test", localId:7, localName:"DI3", direction:"input", port:"digital", type:"switch", name:"door", unit:"", value:"on", description:"is door open", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI3);

var DI4 = {owner:"864-test", localId:8, localName:"DI4", direction:"input", port:"digital", type:"switch", name:"digital input 4", unit:"", value:"on", description:"is door open", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI4);

var DI5 = {owner:"864-test", localId:9, localName:"DI5", direction:"input", port:"digital", type:"switch", name:"digital input 5", unit:"", value:"on", description:"is door open", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI5);

var DI6 = {owner:"864-test", localId:10, localName:"DI6", direction:"input", port:"digital", type:"switch", name:"digital input 6", unit:"", value:"on", description:"is door open", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI6);

var RELAY1 = {owner:"864-test", localId:11, localName:"RELAY1", direction:"output", port:"relay", type:"relay", name:"relay 1", value:"on", description:"switch master power", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY1);
var RELAY2 = {owner:"864-test", localId:12, localName:"RELAY2", direction:"output", port:"relay", type:"relay", name:"relay 2", value:"off", description:"switch master power", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY2);
var RELAY3 = {owner:"864-test", localId:13, localName:"RELAY3", direction:"output", port:"relay", type:"relay", name:"relay 3", value:"off", description:"switch master power", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY3);
var RELAY4 = {owner:"864-test", localId:14, localName:"RELAY4", direction:"output", port:"relay", type:"relay", name:"relay 4", value:"off", description:"switch master power", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY4);
var RELAY5 = {owner:"864-test", localId:15, localName:"RELAY5", direction:"output", port:"relay", type:"relay", name:"relay 5", value:"off", description:"switch master power", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY5);
var RELAY6 = {owner:"864-test", localId:16, localName:"RELAY6", direction:"output", port:"relay", type:"relay", name:"relay 6", value:"off", description:"switch master power", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY6);

var PWM1 = {owner:"864-test", localId:17, localName:"PWM1", direction:"output", port:"pwm", type:"pwm", name:"pwm light", value:"off", freq:"100Hz", duty:"50%", description:"switch master power", planId:null, planSwitch:"enabled"}
contactAll.addContact(PWM1);
var PWM2 = {owner:"864-test", localId:18, localName:"PWM2", direction:"output", port:"pwm", type:"pwm", name:"pwm 2", value:"off", freq:"100Hz", duty:"50%", description:"switch master power", planId:null, planSwitch:"enabled"}
contactAll.addContact(PWM2);

var time = {owner:"864-test", localId:19, localName:"time", direction:"input", type:"time", name:"localTime", time:"8:45 AM", weekday:5, planIdGroup:[], lock:"unlocked"};
contactAll.addContact(time);

//Add Plan For Test
var planOnMasterPower = {owner:"864-test", localName:"0", name:"plan for master power", outputId:"RELAY1", outputValue:"off", judgeGroup:[]};
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
planAll.attachPlan("864-test", "0");

var planOnPwmLight = {owner:"864-test", localName:"1", name:"plan for pwm light", outputId:"PWM1", outputValue:"on", judgeGroup:[]};
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
planAll.attachPlan("864-test", "1");

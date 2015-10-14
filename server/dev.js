//Add Contacts For Test
var AI1 = {owner:"864-dev", localId:1, localName:"AI1", direction:"input", port:"analog", type:"adc", name:"analog input 1", unit:"", value:null, description:"an analog input", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(AI1);

var AI2 = {owner:"864-dev", localId:2, localName:"AI2", direction:"input", port:"analog", type:"adc", name:"analog input 2", unit:"", value:null, description:"an analog input", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(AI2);

var AI3 = {owner:"864-dev", localId:3, localName:"AI3", direction:"input", port:"analog", type:"adc", name:"analog input 3", unit:"", value:null, description:"an analog input", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(AI3);

var AI4 = {owner:"864-dev", localId:4, localName:"AI4", direction:"input", port:"analog", type:"adc", name:"analog input 4", unit:"", value:null, description:"an analog input", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(AI4);

var DI1 = {owner:"864-dev", localId:5, localName:"DI1", direction:"input", port:"digital", type:"switch", name:"digital input 1", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI1);

var DI2 = {owner:"864-dev", localId:6, localName:"DI2", direction:"input", port:"digital", type:"switch", name:"digital intput 2", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI2);

var DI3 = {owner:"864-dev", localId:7, localName:"DI3", direction:"input", port:"digital", type:"switch", name:"digital input 3", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI3);

var DI4 = {owner:"864-dev", localId:8, localName:"DI4", direction:"input", port:"digital", type:"switch", name:"digital input 4", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI4);

var DI5 = {owner:"864-dev", localId:9, localName:"DI5", direction:"input", port:"digital", type:"switch", name:"digital input 5", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI5);

var DI6 = {owner:"864-dev", localId:10, localName:"DI6", direction:"input", port:"digital", type:"switch", name:"digital input 6", unit:"", value:null, description:"a digital input", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(DI6);

var RELAY1 = {owner:"864-dev", localId:11, localName:"RELAY1", direction:"output", port:"relay", type:"relay", name:"relay 1", value:"off", description:"a relay", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY1);
var RELAY2 = {owner:"864-dev", localId:12, localName:"RELAY2", direction:"output", port:"relay", type:"relay", name:"relay 2", value:"off", description:"a relay", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY2);
var RELAY3 = {owner:"864-dev", localId:13, localName:"RELAY3", direction:"output", port:"relay", type:"relay", name:"relay 3", value:"off", description:"a relay", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY3);
var RELAY4 = {owner:"864-dev", localId:14, localName:"RELAY4", direction:"output", port:"relay", type:"relay", name:"relay 4", value:"off", description:"a relay", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY4);
var RELAY5 = {owner:"864-dev", localId:15, localName:"RELAY5", direction:"output", port:"relay", type:"relay", name:"relay 5", value:"off", description:"a relay", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY5);
var RELAY6 = {owner:"864-dev", localId:16, localName:"RELAY6", direction:"output", port:"relay", type:"relay", name:"relay 6", value:"off", description:"a relay", planId:null, planSwitch:"disabled"};
contactAll.addContact(RELAY6);

var PWM1 = {owner:"864-dev", localId:17, localName:"PWM1", direction:"output", port:"pwm", type:"pwm", name:"pwm 1", value:"off", freq:"0", duty:"50%", description:"a pwm output", planId:null, planSwitch:"disabled"}
contactAll.addContact(PWM1);
var PWM2 = {owner:"864-dev", localId:18, localName:"PWM2", direction:"output", port:"pwm", type:"pwm", name:"pwm 2", value:"off", freq:"0", duty:"50%", description:"a pwm output", planId:null, planSwitch:"disabled"}
contactAll.addContact(PWM2);

var email = {owner: "864-dev", localId:19, localName:"email", direction:"output", type:"email", name:"email", planId:null};
contactAll.addContact(email);

var time = {owner:"864-dev", localId:20, localName:"time", direction:"input", type:"time", name:"localTime", planIdGroup:[], lock:"unlocked"};
contactAll.addContact(time);

var profile = {owner:"864-dev", isOnline:false};
profileAll.addProfile(profile);
/*
//Add Plan For Test
var planOnMasterPower = {owner:"864-dev", localName:"0", name:"plan for master power", outputId:"RELAY1", outputValue:"off", judgeGroup:[]};
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
planAll.attachPlan("864-dev", "0");

var planOnPwmLight = {owner:"864-dev", localName:"1", name:"plan for pwm light", outputId:"PWM1", outputValue:"on", judgeGroup:[]};
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
planAll.attachPlan("864-dev", "1");
*/

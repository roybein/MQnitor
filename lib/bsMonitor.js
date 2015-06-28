DigitalInputs = new Mongo.Collection("digitalInputs");
AnalogInputs = new Mongo.Collection("analogInputs");
JudgeGroup = new Mongo.Collection("judge");

sensorAll = new SensorBase(new Mongo.Collection("sensors"));
var sensorLight = new Sensor("1", "light", "lux", 777, "a fake sensor", []);
sensorAll.addSensor(sensorLight);

relayAll = new RelayBase(new Mongo.Collection("relays"));
var relayMasterPower = new Relay("1", "master power", "on", "switch master power", null, null);
relayAll.addRelay(relayMasterPower);

planAll = new PlanBase(new Mongo.Collection("plans"));
var planOnMasterPower = new Plan("1", "plan for master power", "1", []);
var judgeElem1 = new JudgeElem("1", "1", 500, 600, true, "ori");
planOnMasterPower.addJudgeElem(judgeElem1);
planAll.addPlan(planOnMasterPower);

planAll.attachPlan(sensorAll, relayAll, "1", "off", "1");

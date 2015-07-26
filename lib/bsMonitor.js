DigitalInputs = new Mongo.Collection("digitalInputs");
AnalogInputs = new Mongo.Collection("analogInputs");

sensorAll = new SensorBase(new Mongo.Collection("sensors"));
var sensorLight = new Sensor("1", "light", "lux", 777, "a light sensor", []);
sensorAll.addSensor(sensorLight);
var sensorTemperature = new Sensor("2", "temperature", "C", 30, "a temperature sensor", []);
sensorAll.addSensor(sensorTemperature);

relayAll = new RelayBase(new Mongo.Collection("relays"));
var relayMasterPower = new Relay("1", "master power", "on", "switch master power", null, null);
relayAll.addRelay(relayMasterPower);

planAll = new PlanBase(new Mongo.Collection("plans"));

/*
var planOnMasterPower = new Plan("1", "plan for master power", "1", "off", []);
var judgeElem1 = new JudgeElem("1", "1", 500, 600, true, "ori");
var judgeElem2 = new JudgeElem("2", "2", 35, 40, true, "and");
planOnMasterPower.addJudgeElem(judgeElem1);
planOnMasterPower.addJudgeElem(judgeElem2);
planAll.addPlan(planOnMasterPower);
planAll.attachPlan("1", "1");
*/

//planNew = new PlanBase(new Mongo.Collection("planNew"));
//newPlan = new Plan("new", "dummy_name", "dummy_relay_index", "dummy_plan_value", []);
//Session.set('newPlan', EJSON.toJSONValue(newPlan));
//planNew.addPlan(newPlan);
//newJudgeElem = new JudgeElem("new", "dummy_sensorIndex", 0, 0, true, "ori");
//planNew.updatePlan(newPlan);


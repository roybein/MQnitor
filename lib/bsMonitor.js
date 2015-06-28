DigitalInputs = new Mongo.Collection("digitalInputs");
AnalogInputs = new Mongo.Collection("analogInputs");
JudgeGroup = new Mongo.Collection("judge");

sensorAll = new SensorBase(new Mongo.Collection("sensors"));
var sensorLight = new Sensor("1", "light", "lux", 777, "a fake sensor");
sensorAll.addSensor(sensorLight);

relayAll = new RelayBase(new Mongo.Collection("relays"));
var relayMasterPower = new Relay("1", "master power", "on", "switch master power", 0);
relayAll.addRelay(relayMasterPower);

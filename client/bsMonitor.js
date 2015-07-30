Template.monitor.helpers({

	sensors: function() {
		return sensorAll.collec.find({});
	},

	digitalInputs: function() {
		return DigitalInputs.find({});
	},

	analogInputs: function() {
		return AnalogInputs.find({});
	},

	relays: function() {
		return relayAll.collec.find({});
	},

	plans: function() {
		return planAll.collec.find({_id:{$ne:'new'}});
	},
});

Template.monitor.events({
    "click #createPlan": function(event, template) {
        //var plan = planAll.getPlan("new");
        var plan = new Plan("new", null, null, null, []);
        console.log("get new plan:", plan);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        $('.long.modal')
            .modal({observeChanges: true});
        $('.long.modal')
            .modal('show');
    },

});

Template.relay.helpers({
	relayOffCheck: function() {
		return this.value === "off" ? 'checked' : '';
	},
	
	relayOnCheck: function() {
		return this.value === "on"? 'checked' : '';
	},

	relayAutoCheck: function() {
		return this.value === "auto"? 'checked' : '';
	},

	plan: function() {
		if(this.planId === null) {
            return "no plan";
		} else {
			var plan = planAll.getPlan(this.planId);
            if (plan != null) {
                return plan.name;
            } else {
                return null;
            }
		}
	},

    buttonName: function() {
        if(this.planId === null) {
            return "Add";
        } else {
            return "Edit";
        }
    }
});

Template.relay.events({
  "change .relay-control": function (event, template) {
		console.log(event.target.id, event.target.value);
        relayAll.collec.update({_id:event.target.id}, {$set:{value:event.target.value}});
  }
});

Template.plan.events({
    "click #editPlan": function(event, template) {
        var plan = planAll.getPlan(this._id);
        console.log("get onePlan from planAll:", plan);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        $('.long.modal')
            .modal({observeChanges: true});
        $('.long.modal')
            .modal('show');
        
    },

    "click #delPlan": function(event, template) {
        console.log("delPlan:", this._id);
        planAll.delPlan(this._id);
    },
});

Template.judgeElem.helpers({
    isNew: function() {
        if(this.index === "new") {
            return true;
        } else {
            return false;
        }
    }
});

Template.onePlan.helpers({
    onePlan: function() {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        if (plan != null) {
            console.log("return onePlan in helpers:", plan);
            return plan;
        } else {
            return null;
        }
    },
});

Template.onePlan.events({
    "click #savePlan": function (event, template) {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        if(plan.index == "new") {        
            plan.index = planAll.collec.find().count().toString();
            console.log("savePlan:", plan);
            planAll.addPlan(plan);
        } else {
            planAll.updatePlan(plan);
        }
        $('.long.modal')
            .modal('hide');
        return false;
    },

    "click #addJudgeElem": function (event, template) {
        newJudgeElem = new JudgeElem("new", "dummy_sensorIndex", 0, 0, true, "ori");
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        console.log(plan);
        plan.addJudgeElem(newJudgeElem);
        console.log("after addJudgeElem plan=", plan);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        var checkPlan = EJSON.fromJSONValue(Session.get("onePlan"));
        console.log("after addJudgeElem plan=", checkPlan);
        return false;
    },

    "click #deleteJudgeElem": function (event, template) {
        console.log("delete judgeElem: ", this.index);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.delJudgeElem(this.index);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        return false;
    },

    "change #planIndex": function (event, template) {
        console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.index = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
    
    "change #planName": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        console.log(plan);
        plan.name = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #relayIndex": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.relayIndex = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #relayValue": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.relayValue = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    }
});

/*
Template.judgeElem.events({
    "click #deleteJudgeElem": function (event, template) {
        console.log("delete judgeElem: ", this.index);
        newPlan.delJudgeElem(this.index);
        planAll.updatePlan(newPlan);
        return false;
    },
});
Template.newJudgeElem.helpers({
    index: function() {
        return newJudgeElem.index;
    },

    sensorIndex: function() {
        return newJudgeElem.sensorIndex;
    },

    yesMin: function() {
        return newJudgeElem.yesMin;
    },

    yesMax: function() {
        return newJudgeElem.yesMax;
    },

    logicValue: function() {
        return newJudgeElem.logicValue;
    },

    logicType: function() {
        return newJudgeElem.logicType;
    }
});
*/
Template.judgeElem.events({
   /* 
    "change #index": function (event, template) {
      	console.log(event.target.id, event.target.value);
        plan = planAll.getPlan(Session.get("modifyPlanIndex"));
        var judgeElem = plan.getJudgeElem(this.index);
        judgeElem.index = event.target.value;
        plan.updateJudgeElem(judgeElem);
        planAll.updatePlan(plan);
    },
   */ 
    "change #sensorIndex": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        console.log(plan);
        console.log("this.index=", this.index);
        var judgeElem = plan.getJudgeElem(this.index);
        console.log(judgeElem);
        judgeElem.sensorIndex = event.target.value;
        plan.updateJudgeElem(judgeElem);
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
    
    "change #yesMin": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        console.log("this=", this);
        var judgeElem = plan.getJudgeElem(this.index);
        judgeElem.yesMin = event.target.value;
        plan.updateJudgeElem(judgeElem);
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
    
    "change #yesMax": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var judgeElem = plan.getJudgeElem(this.index);
        judgeElem.yesMax = event.target.value;
        plan.updateJudgeElem(judgeElem);
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
    
    "change #logicValue": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var judgeElem = plan.getJudgeElem(this.index);
        judgeElem.logicValue = event.target.value;
        plan.updateJudgeElem(judgeElem);
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
    
    "change #logicType": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var judgeElem = plan.getJudgeElem(this.index);
        judgeElem.logicType = event.target.value;
        plan.updateJudgeElem(judgeElem);
        Session.set("onePlan", EJSON.toJSONValue(plan));
    }
});

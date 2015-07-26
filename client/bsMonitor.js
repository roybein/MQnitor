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
    "click #createNewPlan": function(event, template) {
        newPlan = new Plan("new", "dummy_name", "dummy_relay_index", "dummy_plan_value", []);
        Session.set('newPlan', EJSON.toJSONValue(newPlan));
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
			return planAll.getPlan(this.planId).name;
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
        console.log("editPlan:", this._id);
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
/*
Template.newPlan.helpers({
    index: function() {
        return planNew.getPlan("new").index;
    },

    name: function() {
        return planNew.getPlan("new").name;
    },

    relayIndex: function() {
        return planNew.getPlan("new").relayIndex;
    },

    relayValue: function() {
        return planNew.getPlan("new").relayValue;
    },

    judgeGroup: function() {
        return planNew.getPlan("new").judgeGroup;
    }
});
*/

Template.newPlan.helpers({
    index: function() {
        var newPlan = EJSON.fromJSONValue(Session.get("newPlan"));
        console.log("newPlan helpers:", newPlan);
        if (newPlan) {
            return newPlan.index;
        } else {
            return null;
        }
    },

    name: function() {
        var newPlan = EJSON.fromJSONValue(Session.get("newPlan"));
        if (newPlan) {
            return newPlan.name;
        } else {
            return null;
        }
    },

    relayIndex: function() {
        var newPlan = EJSON.fromJSONValue(Session.get("newPlan"));
        if (newPlan) {
            return newPlan.relayIndex;
        } else {
            return null;
        }
    },

    relayValue: function() {
        var newPlan = EJSON.fromJSONValue(Session.get("newPlan"));
        if (newPlan) {
            return newPlan.relayValue;
        } else {
            return null;
        }
    },

    judgeGroup: function() {
        var newPlan = EJSON.fromJSONValue(Session.get("newPlan"));
        console.log(newPlan);
        if (newPlan) {
            return newPlan.judgeGroup;
        } else {
            return null;
        }
    }
});

Template.newPlan.events({
    "click #savePlan": function (event, template) {
        planAll.addPlan(newPlan);
        return false;
    },

    "click #addJudgeElem": function (event, template) {
        newJudgeElem = new JudgeElem("new", "dummy_sensorIndex", 0, 0, true, "ori");
        newPlan.addJudgeElem(newJudgeElem);
        Session.set('newPlan', EJSON.toJSONValue(newPlan));
        return false;
    },

    "click #deleteJudgeElem": function (event, template) {
        console.log("delete judgeElem: ", this.index);
        newPlan.delJudgeElem(this.index);
        Session.set('newPlan', EJSON.toJSONValue(newPlan));
        return false;
    },

    "change #planIndex": function (event, template) {
        console.log(event.target.id, event.target.value);
        newPlan.index = event.target.value;
        Session.set('newPlan', EJSON.toJSONValue(newPlan));
    },
    
    "change #planName": function (event, template) {
      	console.log(event.target.id, event.target.value);
        newPlan.name = event.target.value;
        Session.set('newPlan', EJSON.toJSONValue(newPlan));
    },

    "change #relayIndex": function (event, template) {
      	console.log(event.target.id, event.target.value);
        newPlan.relayIndex = event.target.value;
        Session.set('newPlan', EJSON.toJSONValue(newPlan));
    },

    "change #relayValue": function (event, template) {
      	console.log(event.target.id, event.target.value);
        newPlan.relayValue = event.target.value;
        Session.set('newPlan', EJSON.toJSONValue(newPlan));
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

    
    "change #index": function (event, template) {
        console.log(event.target.id, event.target.value);
        console.log(newJudgeElem);
        newJudgeElem.index = event.target.value;
    },
    
    "change #sensorIndex": function (event, template) {
        console.log(event.target.id, event.target.value);
        newJudgeElem.sensorIndex = event.target.value;
    },
    
    "change #yesMin": function (event, template) {
        console.log(event.target.id, event.target.value);
        newJudgeElem.yesMin = event.target.value;
    },
    
    "change #yesMax": function (event, template) {
      	console.log(event.target.id, event.target.value);
        newJudgeElem.yesMax = event.target.value;
    },
    
    "change #logicValue": function (event, template) {
      	console.log(event.target.id, event.target.value);
        newJudgeElem.logicValue = event.target.value;
    },
    
    "change #logicType": function (event, template) {
      	console.log(event.target.id, event.target.value);
        newJudgeElem.logicType = event.target.value;
    }
});

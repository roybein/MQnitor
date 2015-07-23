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
    "click #newPlan": function (event, template) {
        console.log("edit a new plan");
        $('.fullscreen.long.reserved.modal')
            .modal('show');
    },
});

/*
Template.example.events({
  "click .alert": function (event, template) {
    alert("My button was clicked!");
  },
  "submit form": function (event, template) {
    var inputValue = event.target.myInput.value;
    var helperValue = this;
    alert(inputValue);
  }
});
*/

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

Template.newPlan.helpers({
    index: function() {
        return planAll.getPlan("new").index;
    },

    name: function() {
        return planAll.getPlan("new").name;
    },

    relayIndex: function() {
        return planAll.getPlan("new").relayIndex;
    },

    relayValue: function() {
        return planAll.getPlan("new").relayValue;
    },

    judgeGroup: function() {
        return planAll.getPlan("new").judgeGroup;
    }
});

/*
Template.newPlan.helpers({
    index: function() {
        return newPlan.index;
    },

    name: function() {
        return newPlan.name;
    },

    relayIndex: function() {
        return newPlan.relayIndex;
    },

    relayValue: function() {
        return newPlan.relayValue;
    },

    judgeGroup: function() {
        return newPlan.judgeGroup;
    }
});
*/

Template.newPlan.events({
/*
    "click #addPlan": function (event, template) {
        console.log("add newPlan to be Plan:", planAll.collec.find().count());
        var plan = _.clone(newPlan)
        plan.index = planAll.collec.find().count();
        planAll.addPlan(plan);
        return false;
    },
*/


    "change #form-planIndex": function (event, template) {
        console.log(event.target.id, event.target.value);
        newPlan.index = event.target.value;
        planAll.updatePlan(newPlan);
    },
    
    "change #form-planName": function (event, template) {
      	console.log(event.target.id, event.target.value);
        newPlan.name = event.target.value;
        planAll.updatePlan(newPlan);
    },

    "change #form-relayIndex": function (event, template) {
      	console.log(event.target.id, event.target.value);
        newPlan.relayIndex = event.target.value;
        planAll.updatePlan(newPlan);
    },

    "change #form-relayValue": function (event, template) {
      	console.log(event.target.id, event.target.value);
        newPlan.relayValue = event.target.value;
        planAll.updatePlan(newPlan);
    }
});

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

Template.newJudgeElem.events({
    "click #addJudgeElem": function (event, template) {
        var judgeElem = _.clone(newJudgeElem)
        console.log("add ", judgeElem);
        newPlan.addJudgeElem(judgeElem);
        planAll.updatePlan(newPlan);
        return false;
    },
    
    "change #index": function (event, template) {
        console.log(event.target.id, event.target.value);
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


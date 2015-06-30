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

});

Template.monitor.events({
  "submit form": function (event, template) {
    var inputValue = event.target.myInput.value;
    var helperValue = this;
    alert(inputValue);
  }
});

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

Template.newPlan.helpers({
    planIndex: function() {
        return newPlan.index;
    },

    planName: function() {
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

Template.relay.events({
  "change .relay-control": function (event, template) {
		console.log(event.target.id, event.target.value);
        relayAll.collec.update({_id:event.target.id}, {$set:{value:event.target.value}});
  }
});


Template.monitor.helpers({

	inputs: function() {
		return contactAll.collec.find({direction:"input"});
	},

	outputs: function() {
		return contactAll.collec.find({direction:"output"});
	},

	plans: function() {
		return planAll.collec.find({});
	},
});

Template.monitor.events({
    "click #createPlan": function(event, template) {
        var plan = {_id:"new", name:null, outputId:null, outputValue:null, judgeGroup:[]};
        console.log("get new plan:", plan);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        $('.long.modal')
            .modal({observeChanges: true});
        $('.long.modal')
            .modal('show');
    },
});

Template.output.helpers({
	outputOffCheck: function() {
		return this.value === "off" ? 'checked' : '';
	},
	
	outputOnCheck: function() {
		return this.value === "on"? 'checked' : '';
	},

	outputAutoCheck: function() {
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

Template.output.events({
  "change .output-control": function (event, template) {
		console.log(event.target.id, event.target.value);
        contactAll.collec.update({_id:event.target.id}, {$set:{value:event.target.value}});
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
	outputsForPlan: function() {
		var ret =  contactAll.collec.find({direction:"output"});
        return ret;
	},

    onePlan: function() {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        if (plan != null) {
            console.log("return onePlan in helpers:", plan);
            return plan;
        } else {
            return null;
        }
    },

    judgeElemInputs: function() {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        return plan.judgeGroup.filter( function(el) {
            return el.inputId !== "weekday" &&
                    el.inputId !== "time";
        });
    }
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
/*
    "change #planIndex": function (event, template) {
        console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.index = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
*/   
    "change #planName": function (event, template) {
      	console.log(event.target.id, ":", event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.name = event.target.value;
        console.log(plan);
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "click #planOutputSel": function (event, template) {
        //console.log("here click dropdown");
        $('#planOutputSel').dropdown();
    },

    "change #planOutputSel": function (event, template) {
      	console.log(event.target.id, ":", event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.outputId = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
        console.log("output type:", event.target.id);
        var output = contactAll.collec.findOne({name:event.target.value});
        if(output.type == "pwm") {
            console.log("is pwm, show pwm field");
            document.getElementById("pwm field").style.display="";       
        } else {
            console.log("not pwm, hide pwm field");
            document.getElementById("pwm field").style.display="none";       
        }
    },

    "click #planRelayValue": function (event, template) {
        //console.log("here click dropdown");
        $('#planRelayValue').dropdown();
    },

    "change #outputValue": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.outputValue = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "click #addJudgeElem": function (event, template) {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        newJudgeElem = {_id:"new"};
        newJudgeElem._id = plan.judgeGroup.length.toString();
        plan = addJudgeElem(plan, newJudgeElem);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        return false;
    },

    "click #delJudgeElem": function (event, template) {
        console.log("delete judgeElem ", this._id);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan = delJudgeElem(plan, this.index);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        return false;
    },
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

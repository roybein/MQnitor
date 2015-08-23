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
        if (plan != null) {
            return plan.judgeGroup.filter( function(el) {
                return el.inputId !== "time";
            });
        } else {
            return null;
        }
    },

    judgeElemTimeInputs: function() {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        if (plan != null) {
            return plan.judgeGroup.filter( function(el) {
                return el.inputId == "time";
            });
        } else {
            return null;
        }
    },
});

Template.onePlan.events({
    "click #savePlan": function (event, template) {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        if(plan._id == "new") {
            plan._id = planAll.collec.find().count().toString();
            console.log("savePlan:", plan);
            planAll.addPlan(plan);
						planAll.attachPlan(plan._id);
        } else {
						planAll.detachPlan(plan._id);
            planAll.updatePlan(plan);
						planAll.attachPlan(plan._id);
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
/*
    "click #planOutputSel": function (event, template) {
        //console.log("here click dropdown");
        $('#planOutputSel').dropdown();
    },
*/
    "change #planOutputSel": function (event, template) {
      	console.log(event.target.id, ":", event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
				var output = contactAll.collec.findOne({name:event.target.value});
        plan.outputId = output._id;
        Session.set("onePlan", EJSON.toJSONValue(plan));
        if(output.type == "pwm") {
            console.log("is pwm, show pwm field");
            document.getElementById("pwm field").style.display="";
        } else {
            console.log("not pwm, hide pwm field");
            document.getElementById("pwm field").style.display="none";
        }
    },
/*
    "click #planRelayValue": function (event, template) {
        //console.log("here click dropdown");
        $('#planRelayValue').dropdown();
    },
*/
    "change #outputValue": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.outputValue = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "click #addJudgeElemTimeInput": function (event, template) {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        newJudgeElem = {_id:"time", inputId:"time"};
        plan = addJudgeElem(plan, newJudgeElem);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        document.getElementById("addJudgeElemTimeInput")
            .style.display="none";
        return false;
	},

    "click #addJudgeElemInput": function (event, template) {
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
        plan = delJudgeElem(plan, this._id);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        if (this._id === "time") {
            document.getElementById("addJudgeElemTimeInput")
                .style.display="";
        }
        return false;
    },

});

Template.judgeElemInput.helpers({
	inputsForJudgeElem: function() {
		var ret =  contactAll.collec.find({direction:"input"});
        console.log("here return:", ret);
        return ret;
	},

    inputSelected: function (inputId) {
        console.log("this:", this);
        console.log("inputId:", inputId);
        //var input = contactAll.collec.findOne({_id:this.inputId});
        //console.log("input:", input);
        //return input.name;
    },
});

Template.judgeElemInput.events({
/*
    "click #judgeElemInputSel": function (event, template) {
        console.log("here click dropdown");
        $('#judgeElemInputSel').dropdown();
    },
*/
    "change #judgeElemInputSel": function(event, template) {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        var input = contactAll.collec.findOne({name:event.target.value});
        console.log("select input:", input);
        jg[this._id].inputId = input._id;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
        switch (input.type) {
            case "adc":
            case "sensor":
            case "wire":
                document.getElementById("judgeElemValueMinMax")
                    .style.display="";
                document.getElementById("judgeElemWaterMark")
                    .style.display="none";
                document.getElementById("judgeElemValueTrue")
                    .style.display="none";
                break;
            case "switch":
                document.getElementById("judgeElemValueMinMax")
                    .style.display="none";
                document.getElementById("judgeElemWaterMark")
                    .style.display="none";
                document.getElementById("judgeElemValueTrue")
                    .style.display="";
                break;
            case "counter":
                document.getElementById("judgeElemValueMinMax")
                    .style.display="none";
                document.getElementById("judgeElemWaterMark")
                    .style.display="";
                document.getElementById("judgeElemValueTrue")
                    .style.display="none";
                break;
            default:
                console.log("unkown input type");
        }
    },

    "change #judgeElemLogicOp": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg.forEach( function (elem, index, array) {
            console.log("this._id=", this._id);
            if (elem._id === this._id) {
                console.log(elem);
                jg[index].logicOp = event.target.value;
            }
        }, this);
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #judgeElemValueMin": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this._id].valueMin = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #judgeElemValueMax": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this._id].valueMax = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #judgeElemWaterMark": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this._id].waterMark = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #judgeElemValueTrue": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this._id].valueTrue = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
});

Template.judgeElemTimeInput.events({
    "change #timeStart": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this._id].timeStart = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #timeEnd": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this._id].timeEnd = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #weekdayRepeat": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this._id].weekdayRepeat = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
});

Template.judgeElemInput.onRendered( function() {
    this.find('option.inputForJudgeElem#' + this.data.inputId).setAttribute("selected", "selected");
    this.find('option.logicOpForJudgeElem[value=' + this.data.logicOp + "]").setAttribute("selected", "selected");
});

Template.onePlan.onRendered( function() {
    this.find('option.outputForPlan#' + this.data.outputId).setAttribute("selected", "selected");
    this.find('option.outputValueForPlan[value=' + this.data.outputValue + "]").setAttribute("selected", "selected");
});

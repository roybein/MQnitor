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
        console.log("edit plan:", plan);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        $('.long.modal')
            .modal({observeChanges: true, onShow: planModalOnShow });
        $('.long.modal')
            .modal('show');
    },

    "click #delPlan": function(event, template) {
        console.log("delPlan:", this._id);
        planAll.delPlan(this._id);
    },
});

planModalOnShow = function() {
    console.log("planModalOnShow");
    var plan = EJSON.fromJSONValue(Session.get("onePlan"));
    $('.outputForPlan#' + plan.outputId).attr("selected", "selected");
    $('.outputValueForPlan#' + plan.outputValue).attr("selected", "selected");
}

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

    isPwmDisplay: function() {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var output = contactAll.collec.findOne({_id:plan.outputId});
        if (output.type === "pwm") {
            return "";
        } else {
            return "none";
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
        //TOOD: validate
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
        newJudgeElem = {index:"new", inputId:"time", repeatDays:[], logicOp:"and"};
        newJudgeElem.index = plan.judgeGroup.length.toString();
        plan = addJudgeElem(plan, newJudgeElem);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        return false;
	},

    "click #addJudgeElemInput": function (event, template) {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        newJudgeElem = {index:"new"};
        newJudgeElem.index = plan.judgeGroup.length.toString();
        plan = addJudgeElem(plan, newJudgeElem);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        return false;
    },

    "click #delJudgeElem": function (event, template) {
        console.log("delete judgeElem ", this.index);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan = delJudgeElem(plan, this.index);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        return false;
    },

});

Template.judgeElemInput.helpers({
	inputsForJudgeElem: function() {
        return contactAll.collec.find({$and:[{direction:"input"},{type:{$ne:"time"}}]});
	},

    isValueMinMaxDisplay: function() {
        var input = contactAll.collec.findOne({_id:this.inputId});
        console.log(input);
        if (input.type === "sensor" ||
            input.type === "adc" ||
            input.type === "wire") {
            return "";
        } else {
            return "none";
        }
    },

    isWaterMarkDisplay: function() {
        var input = contactAll.collec.findOne({_id:this.inputId});
        if (input.type === "counter") {
            return "";
        } else {
            return "none";
        }
    },

    isValueTrueDisplay: function() {
        var input = contactAll.collec.findOne({_id:this.inputId});
        if (input.type === "switch") {
            return "";
        } else {
            return "none";
        }
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
        jg[this.index].inputId = input._id;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #judgeElemLogicOp": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg.forEach( function (elem, index, array) {
            if (elem.index === this.index) {
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
        jg[this.index].valueMin = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #judgeElemValueMax": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this.index].valueMax = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #judgeElemWaterMark": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this.index].waterMark = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #judgeElemValueTrue": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this.index].valueTrue = event.target.value;
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
});

Template.judgeElemTimeInput.helpers({
    timeStartDisplayStr: function () {
        return this.timeStart;
    },

    timeEndDisplayStr: function () {
        return this.timeEnd;
    },

    isRepeatDayActive: function (weekday) {
        if (this.repeatDays.indexOf(weekday) > -1) {
            return "active";
        } else {
            return null;
        }
    },
});

Template.judgeElemTimeInput.events({
    "dp.change #judgeElemTimeStart": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.judgeGroup[this.index].timeStart = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "dp.change #judgeElemTimeEnd": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.judgeGroup[this.index].timeEnd = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "click #1,#2,#3,#4,#5,#6,#7": function (event, template) {
      	console.log("clicked", event.target.id);
        day = Number(event.target.id);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        var dayId = jg[this.index].repeatDays.indexOf(day);
        if (dayId > -1) {
            jg[this.index].repeatDays.splice(dayId, 1);
        } else {
            jg[this.index].repeatDays.push(day);
        }
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
});

Template.judgeElemInput.onRendered( function() {
    this.find('option.inputForJudgeElem#' + this.data.inputId).setAttribute("selected", "selected");
    this.find('option.inputForJudgeElem#' + this.data.inputId).setAttribute("selected", "selected");
    this.find('option.valueTrueForJudgeElem[value=' + this.data.valueTrue + ']').setAttribute("selected", "selected");
});

Template.judgeElemTimeInput.onRendered( function() {
    this.$('.datetimepicker').datetimepicker({format: 'LT'}); 
});

/*
Template.test.events({
    "click #pick-a-time": function (event, template) {
        console.log("clockpicker clicked");
        $('#pick-a-time').lolliclock({autoclose:true});
    },

    "click .datetimepicker": function (event, template) {
        console.log("datetimepicker clicked");
        $('.datetimepicker').datetimepicker({format: 'LT'}); 
    },
});
*/

Template.test.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({format: 'LT'}); 
    this.$('#pick-a-time').lolliclock({autoclose:true});
});

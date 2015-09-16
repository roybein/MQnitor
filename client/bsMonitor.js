Accounts.onLogin(function() {
    console.log("here login");
});

currentUser = function() {
    return Meteor.user().username;
};

Template.topMenu.helpers({
    username: currentUser,
});

Template.config.helpers({
    contacts: function() {
        return contactAll.collec.find();
    },
});

Template.config.events({
    "click #updateConfig": function(event, template) {
        console.log("update config");
        var target = currentUser();
        Meteor.call("doMsgDownBsTargetConfig", target);        
    },

    "change #contactTypeSel": function(event, template) {
        //var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        //var jg = plan.judgeGroup;
        //var input = contactAll.collec.findOne({owner:currentUser(), name:event.target.value});
        //console.log("select input:", input);
        //jg[this.index].inputId = input.localId;
        //plan.judgeGroup = jg;
        //Session.set("onePlan", EJSON.toJSONValue(plan));
    },
});

Template.contact.helpers({
    typesForContact: function(localId) {
        console.log("localId:", localId);
        var idType = localId.substr(0, 2);
        var options = [];
        switch (idType) {
            case "AI":
                options.push({type:"adc"});
                break;
            case "DI":
                options.push({type:"counter"});
                options.push({type:"switch"});
                options.push({type:"sensor"});
                break;
            case "DO":
                options.push({type:"switch"});
                options.push({type:"pwm"});
                break;
            default:
        }
        return options;
    },
});


Template.monitor.helpers({
	inputs: function() {
		return contactAll.collec.find({owner:currentUser(), direction:"input"});
	},
	outputs: function() {
		return contactAll.collec.find({owner:currentUser(), direction:"output"});
	},
	plans: function() {
		return planAll.collec.find({owner:currentUser()});
	},
});

Template.monitor.events({
    "click #createPlan": function(event, template) {
        var outputsForPlan = getOutputsForPlan().fetch();
        var defaultOutputForPlan = outputsForPlan[0]
        var plan = {owner:currentUser(), localId:"new", name:defaultOutputForPlan.name, outputId:defaultOutputForPlan.localId, outputValue:defaultOutputForPlan.value, judgeGroup:[]};
        console.log("get new plan:", plan);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        $('.long.modal')
            .modal({observeChanges: true, onShow: planModalOnShow });
        $('.long.modal')
            .modal('show');
    },
});

Template.input.helpers({
    isLockChecked: function() {
        var input = contactAll.getContact(currentUser(), this.localId);
        if (input.lock === "locked") {
            return "checked";
        } else {
            return "unchecked";
        }
    },
});

Template.input.onRendered( function() {
    $("[name='inputLockCheckbox']").checkbox({
        onChecked: function() {
            console.log("checked Lock", this.id);
            var i = consoleAll.collec.findOne({owner:currentUser(), localId:this.id});
            if (i === null) return;
            contactAll.collec.update({_id:i._id}, {$set:{lock:"locked"}});
        },
        onUnchecked: function() {
            console.log("unchecked Lock", this.id);
            var i = consoleAll.collec.findOne({owner:currentUser(), localId:this.id});
            if (i === null) return;
            contactAll.collec.update({_id:i._id}, {$set:{lock:"unlocked"}});
        },
    });
});

Template.output.helpers({
    isValueSwitchEnable: function() {
        var output = contactAll.getContact(currentUser(), this.localId);
        if (output.planSwitch === "enabled") {
            return "disabled";
        } else {
            return "";
        }
    },

    isValueChecked: function() {
        var output = contactAll.getContact(currentUser(), this.localId);
        if (output.value === "on") {
            return "checked";
        } else {
            return "unchecked";
        }
    },

    isPlanChecked: function() {
        var output = contactAll.getContact(currentUser(), this.localId);
        if (output.planSwitch === "enabled") {
            return "checked";
        } else {
            return "";
        }
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

});

Template.output.onRendered( function() {
    $("[name='outputValueSwitch']").checkbox({
        onChecked: function() {
            console.log("checked value", this.id);
            var o = contactAll.collec.findOne({owner:currentUser(), localId:this.id});
            if (o === null) return;
            Meteor.call("doMsgDownBsTargetOutput", currentUser(), this.id, "on");
            //contactAll.collec.update({_id:o._id}, {$set:{value:"on"}});
        },
        onUnchecked: function() {
            console.log("unchecked value", this.id);
            var o = contactAll.collec.findOne({owner:currentUser(), localId:this.id});
            if (o === null) return;
            Meteor.call("doMsgDownBsTargetOutput", currentUser(), this.id, "off");
            //contactAll.collec.update({_id:o._id}, {$set:{value:"off"}});
        },
    });

    $("[name='outputPlanCheckbox']").checkbox({
        onChecked: function() {
            console.log("checked planSwitch", this.id);
            var o = contactAll.collec.findOne({owner:currentUser(), localId:this.id});
            if (o === null) return;
            contactAll.collec.update({_id:o._id}, {$set:{planSwitch:"enabled"}});
        },
        onUnchecked: function() {
            console.log("unchecked planSwitch", this.id);
            var o = contactAll.collec.findOne({owner:currentUser(), localId:this.id});
            if (o === null) return;
            contactAll.collec.update({_id:o._id}, {$set:{planSwitch:"disabled"}});
        },
    });
});

/*
Template.output.events({
    "changed #outputValueCheckbox": function (event, template) {
        console.log(event.target.id, event.target.value);
        //contactAll.collec.update({localId:event.target.id},
        //    {$set:{value:event.target.value}});
    },
});
*/

Template.plan.events({
    "click [name='editPlan']": function(event, template) {
        var plan = planAll.getPlan(currentUser(), this.localId);
        console.log("edit plan:", plan);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        $('.long.modal')
            .modal({observeChanges: true, onShow: planModalOnShow });
        $('.long.modal')
            .modal('show');
    },

    "click [name='delPlan']": function(event, template) {
        console.log("delPlan:", this.localId);
        planAll.delPlan(currentUser(), this.localId);
    },
});

planModalOnShow = function() {
    console.log("planModalOnShow");
    var plan = EJSON.fromJSONValue(Session.get("onePlan"));
    $('.outputForPlan#' + plan.outputId).attr("selected", "selected");
    $('.outputValueForPlan#' + plan.outputValue).attr("selected", "selected");
}

getOutputsForPlan = function() {
    return  contactAll.collec.find({owner:currentUser(), direction:"output"});
}

Template.onePlan.helpers({
	outputsForPlan: getOutputsForPlan,

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
        if (plan != null) {
            var output = contactAll.collec.findOne({owner:currentUser(), localId:plan.outputId});
            if (output != null && output.type === "pwm") {
                return "";
            } else {
                return "none";
            }
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
        if(plan.localId == "new") {
            plan.localId = planAll.collec.find({owner:currentUser()}).count().toString();
            console.log("savePlan:", plan);
            planAll.addPlan(plan);
            planAll.attachPlan(plan.owner, plan.localId);
        } else {
            planAll.detachPlan(plan.owner, plan.localId);
            planAll.updatePlan(plan);
            planAll.attachPlan(plan.owner, plan.localId);
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
		var output = contactAll.collec.findOne({owner:currentUser(), name:event.target.value});
        plan.outputId = output.localId;
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
        var inputsForJudgeElem = getInputsForJudgeElem().fetch();
        var defaultInputForJudgeElem = inputsForJudgeElem[0];
        newJudgeElem = {index:"new", inputId:defaultInputForJudgeElem.localId };
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

getInputsForJudgeElem = function() {
        return contactAll.collec.find({$and:[{owner:currentUser()},{direction:"input"},{type:{$ne:"time"}}]});
}

Template.judgeElemInput.helpers({
	inputsForJudgeElem: getInputsForJudgeElem,

    isValueMinMaxDisplay: function() {
        var input = contactAll.collec.findOne({owner:currentUser(), localId:this.inputId});
        if (input.type === "sensor" ||
            input.type === "adc" ||
            input.type === "wire") {
            return "";
        } else {
            return "none";
        }
    },

    isWaterMarkDisplay: function() {
        var input = contactAll.collec.findOne({owner:currentUser(), localId:this.inputId});
        if (input.type === "counter") {
            return "";
        } else {
            return "none";
        }
    },

    isValueTrueDisplay: function() {
        var input = contactAll.collec.findOne({owner:currentUser(), localId:this.inputId});
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
        var input = contactAll.collec.findOne({owner:currentUser(), name:event.target.value});
        console.log("select input:", input);
        jg[this.index].inputId = input.localId;
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
    try {
        this.find('option.inputForJudgeElem#' + this.data.inputId).setAttribute("selected", "selected");
        this.find('option.logicOpForJudgeElem[value=' + this.data.logicOp + ']').setAttribute("selected", "selected");
        this.find('option.valueTrueForJudgeElem[value=' + this.data.valueTrue + ']').setAttribute("selected", "selected");
    }
    catch(err) {
    }
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

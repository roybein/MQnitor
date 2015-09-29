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
        return contactAll.collec.find({owner:currentUser()}, {sort:{localId:1}});
    },
});

Template.config.events({
    "click #updateConfig": function(event, template) {
        console.log("update config");
        Meteor.call("doMsgDownBsTargetConfig", currentUser());
    },

    "change #contactTypeSel": function(event, template) {
        //var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        //var jg = plan.judgeGroup;
        //var input = contactAll.collec.findOne({owner:currentUser(), name:event.target.value});
        //console.log("select input:", input);
        //jg[this.index].inputId = input.localName;
        //plan.judgeGroup = jg;
        //Session.set("onePlan", EJSON.toJSONValue(plan));
    },
});

Template.contact.helpers({
    typesForContact: function(port) {
        var options = [];
        switch (port) {
            case "analog":
                options.push({type:"adc"});
                break;
            case "digital":
                options.push({type:"counter"});
                options.push({type:"switch"});
                options.push({type:"sensor"});
                break;
            case "relay":
                options.push({type:"relay"});
            case "pwm":
                options.push({type:"pwm"});
                break;
            default:
        }
        return options;
    },

});

Template.oneContact.helpers({
    oneContact: function() {
        var contact = EJSON.fromJSONValue(Session.get("oneContact"));
        if (contact != null) {
            console.log("return oneContact in helpers:", contact);
            return contact;
        } else {
            return null;
        }
    },

    typesForContact: function(port) {
        var options = [];
        switch (port) {
            case "analog":
                options.push({type:"adc"});
                break;
            case "digital":
                options.push({type:"counter"});
                options.push({type:"switch"});
                options.push({type:"sensor"});
                break;
            case "relay":
                options.push({type:"relay"});
            case "pwm":
                options.push({type:"pwm"});
                break;
            default:
        }
        return options;
    },

    isUnitDisplay: function() {
        var contact = EJSON.fromJSONValue(Session.get("oneContact"));
        console.log("here", contact);
        if (contact != null) {
            if (contact.direction === "input"
                && (contact.type === "adc" ||
                    contact.type === "sensor") ) {
                return "";
            } else {
                return "none";
            }
        } else {
            return "none";
        }
    },
});

Template.oneContact.events({
    "click #saveContact": function (event, template) {
        //TOOD: validate
        var contact = EJSON.fromJSONValue(Session.get("oneContact"));
        if(contact.localName == "new") {
            contact.localName = contactAll.collec.find({owner:currentUser()}).count().toString();
            console.log("saveContact:", contact);
            contactAll.addContact(plan);
        } else {
            contactAll.updateContact(contact);
            Meteor.call("doMsgDownBsTargetConfig", currentUser());
        }

        $('#oneContactModal')
            .modal('hide');
        return false;
    },

    "change #contactName": function (event, template) {
      	console.log(event.target.id, ":", event.target.value);
        var contact = EJSON.fromJSONValue(Session.get("oneContact"));
        contact.name = event.target.value;
        console.log(contact);
        Session.set("oneContact", EJSON.toJSONValue(contact));
    },

    "change #contactTypeSel": function (event, template) {
      	console.log(event.target.id, ":", event.target.value);
        var contact = EJSON.fromJSONValue(Session.get("oneContact"));
		contact.type = event.target.value;
        Session.set("oneContact", EJSON.toJSONValue(contact));
    },

    "change #contactUnit": function (event, template) {
      	console.log(event.target.id, ":", event.target.value);
        var contact = EJSON.fromJSONValue(Session.get("oneContact"));
        contact.unit = event.target.value;
        console.log(contact);
        Session.set("oneContact", EJSON.toJSONValue(contact));
    },
});

Template.monitor.helpers({
	inputs: function() {
		return contactAll.collec.find({$and:[ {owner:currentUser(), direction:"input"}, {type:{$ne:"time"}} ]}, {sort:{localId:1}});
	},
	outputs: function() {
		return contactAll.collec.find({owner:currentUser(), direction:"output"}, {sort:{localId:1}});
	},
	plans: function() {
		return planAll.collec.find({owner:currentUser()});
	},
});

Template.monitor.events({
    "click #createPlan": function(event, template) {
        var outputsForPlan = getOutputsNoPlan().fetch();
        var defaultOutputForPlan = outputsForPlan[0]
        var plan = {owner:currentUser(), localName:"new", name:null,
            outputId:defaultOutputForPlan.localName,
            outputValue:defaultOutputForPlan.value,
            judgeGroup:[]};
        console.log("get new plan:", plan);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        //$('.long.modal')
        $('#onePlanModal')
            .modal({observeChanges: true, onShow: planModalOnShow });
        $('#onePlanModal')
            .modal('show');
    },

    "click [name='editContact']": function(event, template) {
        var contact = contactAll.getContact(currentUser(), this.localName);
        console.log("edit contact:", contact);
        Session.set("oneContact", EJSON.toJSONValue(contact));
        $('#oneContactModal')
            .modal({observeChanges: true, onShow: contactModalOnShow });
        $('#oneContactModal')
            .modal('show');
    },
});

Template.input.helpers({
    isLockChecked: function() {
        var input = contactAll.getContact(currentUser(), this.localName);
        if (input.lock === "locked") {
            return "checked";
        } else {
            return "unchecked";
        }
    },
});
/*
Template.input.events({
    "click [name='editContact']": function(event, template) {
        var contact = contactAll.getContact(currentUser(), this.localName);
        console.log("edit contact:", contact);
        Session.set("oneContact", EJSON.toJSONValue(contact));
        $('#oneContactModal')
            .modal({observeChanges: true, onShow: contactModalOnShow });
        $('#oneContactModal')
            .modal('show');
    },
});
*/
contactModalOnShow = function() {
    console.log("contactModalOnShow");
    var contact = EJSON.fromJSONValue(Session.get("oneContact"));
    $('.typeForContact#' + contact.type).attr("selected", "selected");
}

Template.input.onRendered( function() {
    $("[name='inputLockCheckbox']").checkbox({
        onChecked: function() {
            console.log("checked Lock", this.id);
            var i = consoleAll.collec.findOne({owner:currentUser(), localName:this.id});
            if (i === null) return;
            contactAll.collec.update({_id:i._id}, {$set:{lock:"locked"}});
        },
        onUnchecked: function() {
            console.log("unchecked Lock", this.id);
            var i = consoleAll.collec.findOne({owner:currentUser(), localName:this.id});
            if (i === null) return;
            contactAll.collec.update({_id:i._id}, {$set:{lock:"unlocked"}});
        },
    });
});

Template.output.helpers({
    isValueSwitchEnable: function() {
        var output = contactAll.getContact(currentUser(), this.localName);
        if (output.planSwitch === "enabled") {
            return "disabled";
        } else {
            return "";
        }
    },

    isValueChecked: function() {
        var output = contactAll.getContact(currentUser(), this.localName);
        if (output.value === "on") {
            return "checked";
        } else {
            return "unchecked";
        }
    },

    isPlanChecked: function() {
        var output = contactAll.getContact(currentUser(), this.localName);
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
			var plan = planAll.getPlan(currentUser(), this.planId);
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
            var o = contactAll.collec.findOne({owner:currentUser(), localName:this.id});
            if (o === null) return;
            Meteor.call("doMsgDownBsTargetOutput", currentUser(), this.id, "on");
            contactAll.collec.update({_id:o._id}, {$set:{value:"on"}});
        },
        onUnchecked: function() {
            console.log("unchecked value", this.id);
            var o = contactAll.collec.findOne({owner:currentUser(), localName:this.id});
            if (o === null) return;
            Meteor.call("doMsgDownBsTargetOutput", currentUser(), this.id, "off");
            contactAll.collec.update({_id:o._id}, {$set:{value:"off"}});
        },
    });

    $("[name='outputPlanCheckbox']").checkbox({
        onChecked: function() {
            console.log("checked planSwitch", this.id);
            var o = contactAll.collec.findOne({owner:currentUser(), localName:this.id});
            if (o === null) return;
            contactAll.collec.update({_id:o._id}, {$set:{planSwitch:"enabled"}});
        },
        onUnchecked: function() {
            console.log("unchecked planSwitch", this.id);
            var o = contactAll.collec.findOne({owner:currentUser(), localName:this.id});
            if (o === null) return;
            contactAll.collec.update({_id:o._id}, {$set:{planSwitch:"disabled"}});
        },
    });
});

/*
Template.output.events({
    "changed #outputValueCheckbox": function (event, template) {
        console.log(event.target.id, event.target.value);
        //contactAll.collec.update({localName:event.target.id},
        //    {$set:{value:event.target.value}});
    },
});
*/

Template.plan.events({
    "click [name='editPlan']": function(event, template) {
        var plan = planAll.getPlan(currentUser(), this.localName);
        console.log("edit plan:", plan);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        $('#onePlanModal')
            .modal({observeChanges: true, onShow: planModalOnShow });
        $('#onePlanModal')
            .modal('show');
    },

    "click [name='delPlan']": function(event, template) {
        console.log("delPlan:", this.localName);
        planAll.delPlan(currentUser(), this.localName);
    },
});

planModalOnShow = function() {
    console.log("planModalOnShow");
    var plan = EJSON.fromJSONValue(Session.get("onePlan"));
    $('.outputForPlan#' + plan.outputId).attr("selected", "selected");
    $('.outputValueForPlan#' + plan.outputValue).attr("selected", "selected");
    getOutputsForPlan().forEach( function (elem, index, array) {
        if (elem.planId === null) {
            $('.outputForPlan#' + elem.localName).attr("disabled", null);
        } else {
            $('.outputForPlan#' + elem.localName).attr("disabled", "disabled");
        }
    });
}

getOutputsForPlan = function() {
    return  contactAll.collec.find({owner:currentUser(), direction:"output"});
}

getOutputsNoPlan = function() {
    return  contactAll.collec.find({owner:currentUser(), direction:"output", planId:null});
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
            var output = contactAll.collec.findOne({owner:currentUser(), localName:plan.outputId});
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
        if(plan.localName == "new") {
            plan.localName = planAll.collec.find({owner:currentUser()}).count().toString();
            console.log("savePlan:", plan);
            planAll.addPlan(plan);
            planAll.attachPlan(plan.owner, plan.localName);
        } else {
            planAll.detachPlan(plan.owner, plan.localName);
            planAll.updatePlan(plan);
            planAll.attachPlan(plan.owner, plan.localName);
        }

        $('#onePlanModal')
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
        plan.outputId = output.localName;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },
/*
    "click #planRelayValue": function (event, template) {
        //console.log("here click dropdown");
        $('#planRelayValue').dropdown();
    },
*/
    "change #planOutputValue": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        plan.outputValue = event.target.value;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "click #addJudgeElemTimeInput": function (event, template) {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        newJudgeElem = {index:"new", inputId:"time", repeatDays:[1,2,3,4,5], logicOp:"and"};
        newJudgeElem.index = plan.judgeGroup.length.toString();
        plan = addJudgeElem(plan, newJudgeElem);
        Session.set("onePlan", EJSON.toJSONValue(plan));
        return false;
	},

    "click #addJudgeElemInput": function (event, template) {
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var inputsForJudgeElem = getInputsForJudgeElem().fetch();
        var defaultInputForJudgeElem = inputsForJudgeElem[0];
        newJudgeElem = {index:"new", inputId:defaultInputForJudgeElem.localName, logicOp:"and"};
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
        var input = contactAll.collec.findOne({owner:currentUser(), localName:this.inputId});
        if (input.type === "sensor" ||
            input.type === "adc" ||
            input.type === "wire") {
            return "";
        } else {
            return "none";
        }
    },

    isWaterMarkDisplay: function() {
        var input = contactAll.collec.findOne({owner:currentUser(), localName:this.inputId});
        if (input.type === "counter") {
            return "";
        } else {
            return "none";
        }
    },

    isValueTrueDisplay: function() {
        var input = contactAll.collec.findOne({owner:currentUser(), localName:this.inputId});
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
        jg[this.index].inputId = input.localName;
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
        jg[this.index].valueMin = parseInt(event.target.value);
        plan.judgeGroup = jg;
        Session.set("onePlan", EJSON.toJSONValue(plan));
    },

    "change #judgeElemValueMax": function (event, template) {
      	console.log(event.target.id, event.target.value);
        var plan = EJSON.fromJSONValue(Session.get("onePlan"));
        var jg = plan.judgeGroup;
        jg[this.index].valueMax = parseInt(event.target.value);
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

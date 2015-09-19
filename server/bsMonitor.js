
// register a listener on data collection Sensors
var queryInput = contactAll.collec.find({direction:"input"});

var handle = queryInput.observeChanges({
	changed: function(id, fields) {
        var i = contactAll.collec.findOne({_id:id});
        if( (Object.keys(fields) == 'value') ||
            (Object.keys(fields) == 'time') ||
            (Object.keys(fields) == 'weekday') ) {
            var pIdG = i.planIdGroup;
            pIdG.forEach(function(elem, index, group) {
                planAll.checkPlan(i.owner, elem);
            });
        }
	}
});

var queryPlan = planAll.collec.find();

var handle = queryPlan.observeChanges({
	changed: function(id, fields) {
        var p = planAll.collec.findOne({_id:id});
        planAll.checkPlan(p.owner, p.localName);
	}
});

var queryOutput = contactAll.collec.find({direction:"output"});

var handle = queryOutput.observeChanges({
	changed: function(id, fields) {
        if (Object.keys(fields) == 'planSwitch') {
            var o = contactAll.collec.findOne({_id:id});
            planAll.checkPlan(o.owner, o.planId);
        }
	}
});

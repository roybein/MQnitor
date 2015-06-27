Template.monitor.helpers({

	sensors: function() {
		return Sensors.find({});
	},

	digitalInputs: function() {
		return DigitalInputs.find({});
	},

	analogInputs: function() {
		return AnalogInputs.find({});
	},

	relays: function() {
		return Relays.find({});
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
		return this.status === "off" ? 'checked' : '';
	},
	
	relayOnCheck: function() {
		return this.status === "on"? 'checked' : '';
	},

	relayAutoCheck: function() {
		return this.status === "auto"? 'checked' : '';
	},

	plan: function() {
		if(this.status === "auto") {
			return this.plan;
		} else {
			return "";
		}
	}
});

Template.relay.events({
  "change .relay-control": function (event, template) {
		var element = event.target;
		console.log(element.name, element.value);
		Relays.update({_id:Relays.findOne({index:element.id})['_id']}, {$set:{status:element.value}});
  }
});


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
		if(this.value === "auto") {
			return this.plan;
		} else {
			return "";
		}
	}
});

Template.relay.events({
  "change .relay-control": function (event, template) {
		console.log(event.target.id, event.target.value);
        relayAll.collec.update({_id:event.target.id}, {$set:{value:event.target.value}});
  }
});


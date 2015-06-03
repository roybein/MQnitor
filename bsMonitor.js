Router.route('/', function () {
	this.redirect('/monitor');
});

Router.route('/monitor');

Router.route('/setup');
/*
if (Meteor.isClient) {
	Template.main.helpers({
		sensors: [
			{
				id: "0001",
				name: "Sensor 1",
				value: "24",
				desciption: "connect with kettle",
				check:	"True",
			 },
			{
				id: "0002",
				name: "Sensor 2",
				value: "56",
				desciption: "connect with Fireplace",
				check:	"False",
			}
		]
	});
}
*/

if (Meteor.isClient) {
	Template.monitor.helpers({
		sensors: [
			{	index: "0001",
				name: "sensor 0001",
				value: "24",
				description: "connect with the kettle",
			},
			{	index: "0002",
				name: "sensor 0002",
				value: "89",
				description: "connect with the fireplace",
			},
		],

		digitalInputs: [
			{	name: "Digital Input 1",
				status: "Alarm",
			},
			{	name: "Digital Input 2",
				status: "Open",
			},
		],

		analogInputs: [
			{	name: "Analog Input 1",
				value: "23",
			},
			{	name: "Analog Input 2",
				value: "12",
			},
		]
	});
}

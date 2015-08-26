Router.route('/', function () {
  this.redirect('/home');
});

Router.route('/home');

Router.route('/monitor', function() {
    this.render('monitor');
});

Router.route('/test', function() {
    this.render('test');
});

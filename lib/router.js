Router.route('/', function () {
  this.redirect('/monitor');
});

Router.route('/home');

Router.route('/monitor', function() {
    this.render('monitor');
});

Router.route('/config', function() {
    this.render('config');
});

Router.route('/test', function() {
    this.render('test');
});

Router.plugin('ensureSignedIn', {
    only: ['monitor']
});

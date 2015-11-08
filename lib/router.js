Router.route('/', function () {
  this.redirect('/manage');
});

Router.route('/home');
Router.route('/manage');

Router.route('/monitor/:_id', function() {
    this.render('monitor', {data: this.params._id});
}, {name:'monitor'});

Router.route('/config', function() {
    this.render('config');
});

Router.route('/test', function() {
    this.render('test');
});

Router.plugin('ensureSignedIn', {
    only: ['monitor', 'manage']
});

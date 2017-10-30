var LocalStrategy = require('passport-local').Strategy;


var User            = require('../app/models/user');

module.exports = function(passport) {


	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});


	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'username',
		passReqToCallback: true
	},
	function(req, email, username ,done){
		function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
		var password = makeid();
		process.nextTick(function(){
			User.findOne({'local.username': username}, function(err, user){
				if(err)
					return done(err);
				if(user){
					console.log('The username already taken')
					return done(null, false, req.flash('signupMessage', 'That username already taken'));
				} else {
					var newUser = new User();
					newUser.local.username = username;
					newUser.local.password = password;

					var helper = require('sendgrid').mail;
var fromEmail = new helper.Email('Scrapper_Xeno@iitr.ac.in');
var toEmail = new helper.Email('akshatarora826@gmail.com');
var subject = 'Take Your Authentication Password';
var content = new helper.Content('text/plain', String(password));
var mail = new helper.Mail(fromEmail, subject, toEmail, content);
 
var sg = require('sendgrid')('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');
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON()
});
 
sg.API(request, function (error, response) {
  if (error) {
    console.log('Error response received');
  }
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			})

		});
	}));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({ 'local.username': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(user.local.password != password){
						return done(null, false, req.flash('loginMessage', 'inavalid password'));
					}
					return done(null, user);

				});
			});
		}
	));


};
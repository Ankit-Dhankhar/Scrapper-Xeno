var  fs = require('fs')
var csv = require('csvtojson')
var PythonShell = require('python-shell')
var express = require('express')
var path = process.cwd()
var app = express()
var session = require('express-session')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var serv = require('http').Server(app);
var passport = require('passport')
var flash = require('connect-flash')
var ccname
var cfname
var dat
var port = process.env.PORT || 8080;
var morgan = require('morgan')
var mongoose = require('mongoose')
//app.set('view engine','ejs')
var configDB = require('./config/database.js')
mongoose.connect(configDB.url)
require(path+'/config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({secret: 'kgi353927$&^*gjhf7',
         saveUninitialized: true,
         resave: true}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket){
	console.log('socket connection')



socket.on('ccvalue',function(data){
       ccname=data.ccuser
       cfname=data.cfuser

       
      console.log(ccname)
      console.log(cfname)
    if(ccname)
{
var options = {
    mode: 'text',
    args: [ccname]
};
PythonShell.run('ccscrapper.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
    
});


}
    if(cfname)
{
var options = {
    mode: 'text',
    args: [cfname]
};
PythonShell.run('cfscrapper.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
    
});


}


         
    });

});

app.set('view engine','ejs');

require('./app/routes.js')(app,passport);

serv.listen(port);
console.log("Server Started.")

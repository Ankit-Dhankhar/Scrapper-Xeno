var spawn = require("child_process").spawn;

var express = require('express')
var app = express()
var serv = require('http').Server(app);
var ccname
var cfname
var dat

//app.set('view engine','ejs')

var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket){
	console.log('socket connection')


socket.on('ccvalue',function(data){
       ccname=data.ccuser
       cfname=data.cfuser

       
      console.log(ccname)
      console.log(cfname)

     var process = spawn('python',["./hello.py",ccname,cfname]); 
process.stdout.on('data', function (data){
// Do something with the data returned from python script
dat=data.toString('utf8')
console.log(data.toString('utf8'));
});

         
    });

});



app.get('/',function(req,res){
res.render('index.ejs')
})

serv.listen(8080)
console.log("Server Started.")

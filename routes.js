var XenoUser = require('./models/user');
var path = process.cwd()
var csv = require('csvtojson')
module.exports = function(app,passport){
	app.get('/', function(req, res){
		res.render('signuporlogin.ejs')
	});
app.get('/login',function(req,res){
res.sendFile(path+'/views/login.html');
})
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/codescrap',
		failureRedirect: '/login',
		failureFlash: true
	}));
app.get('/signup', function(req, res){
		res.sendFile(path+'/views/signup.html');
	});

app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));
app.get('/codescrap',isLoggedIn,function(req,res){
	res.render('index.ejs')
})
app.post('/compare',isLoggedIn,function(req,res){
	//console.log('post successful')
	res.render('compare.ejs')
});
app.post('/analyse2',isLoggedIn,function(req,res){
	//console.log('post successful')
	res.render('compare2.ejs')
});
app.post('/com2',isLoggedIn,function(req,res){
	console.log(req.body)
	var user1= req.body.u1name;
	var user2 = req.body.u2name;
	var dataarr=[]
	
	if(req.body.codeforces)
		title='CodeForces';
	else
		title='CodeChef';
  
  var arr = [user1,user2];
  function doit(filename,user){

var userarr=[]
csv()
.fromFile(filename)
.on('json',(data)=>{

userarr.push(data[0])

})
.on('done',(error)=>
{
	console.log("problems: "+userarr)
dataarr.push({"title":title,"user":user,"userarray":userarr})
return (dataarr);
})


};
  	for ( i =0;i<2;i++)
   { 
filename=path+"/"+title+"/csvdatabase/"+arr[i]+".csv"
doit(filename,arr[i])
  setTimeout(function(){console.log("dataarr: "+JSON.stringify(dataarr))
var arrsend=[]
var arr1 = dataarr[0].userarray;
var arr2 = dataarr[1].userarray;
var arri = intersect(arr1,arr2)
console.log(arri)
function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}
arrsend.push({"title":title,"user":"Problems Solved by both "+user1+" and "+user2,"userarray":arri})

var arrd=arr_diff(arr1,arr2)
arrsend.push({"title":title,"user":"Problems Solved by "+user1+" and not by "+user2,"userarray":intersect(arrd,arr1)})
arrsend.push({"title":title,"user":"Problems Solved by "+user2+" and not by "+user1,"userarray":intersect(arrd,arr2)})

function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
};

  	res.render('com',{data:arrsend})
   },3000)}
})


function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}



app.post('/analyse2',isLoggedIn,function(req,res){
	//console.log('post successful')
	res.render('compare2.ejs')
});
app.post('/com',isLoggedIn,function(req,res){
	console.log(req.body)
	
	var dataarr=[]
	var title = req.body.title;

  var opt = req.body.options
  var arr = opt.split('\r\n')

  function doit(filename,user){

var userarr=[]
csv()
.fromFile(filename)
.on('json',(data)=>{

userarr.push(data[0])

})
.on('done',(error)=>
{
	console.log("problems: "+userarr)
dataarr.push({"title":title,"user":user,"userarray":userarr})
return (dataarr);
})


};
  	for ( i =0;i<arr.length;i++)
   { 
filename=path+"/"+title+"/csvdatabase/"+arr[i]+".csv"
doit(filename,arr[i])
  setTimeout(function(){console.log("dataarr: "+JSON.stringify(dataarr))


  	res.render('com',{data:dataarr})
   },3000)}
})
}

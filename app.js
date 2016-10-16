var express   = require('express'),
    httpProxy = require('http-proxy'),
    app       = express(),
	proxy = httpProxy.createProxyServer({}),
	errorhandler = require('errorhandler');
var crypto = require('crypto');
var rand = require('csprng');
var bodyparser = require('body-parser');
var jsonwebtoken = require('jsonwebtoken');
var jwt = require('express-jwt');
var _ = require('underscore');
var cookieParser = require('cookie-parser')
var generate_key = function(user) {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString() + user);
    return sha.digest('hex');
};


var sampledatabase =[{
	username :'admin',
	password : 'abc123',
	salt : 'a random string',
	hpass : 'df924f220fde811bfd4bae993dbe147494615ae33a4ae33f42896d2d5f35df2b304d3f862157e15b279dec9342dc8d98a12e07c71ad681efc3d4ede9af0737a9'
}]
	
function authenticate(req,res,next) {
    
}
var jwtcheck = jwt({
    secret: 'mysecretkey',
    credentialsRequired: true,
    requestProperty : 'userid',
    getToken: function fromHeaderOrQuerystring (req) {
		if(req.cookies.authtoken){
			return req.cookies.authtoken;
		}
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
})
app.use(cookieParser());
app.use(express.static('public'));
app.use(errorhandler());
app.use(bodyparser.urlencoded());
app.use(cookieParser());
app.post('/login',function(req,res){
	var email = req.body.email;
	var pass = req.body.pass;
	var user = getuser(email);
	
        console.log(email +" "+pass);
        if(user ){
            var temp = user.salt;
            var hash_db = user.hpass;
            var id = user.username;
            var newpass = temp + pass;
            var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
			console.log(hashed_password);
            var userdata = user.userdata;
            if(hash_db == hashed_password){
              var sessionid = generate_key(id);
                updateUser(email,sessionid);
				var token = jsonwebtoken.sign({ 'userid':id,sessionkey:sessionid}, 'mysecretkey');
				res.cookie('authtoken' ,token, {maxAge : 9999 ,'domain' : ''});
				res.send({"success":true,'id':id ,'token' : token })
				
            }else{

                res.send({'response':"Invalid Password",'res':false});

            }
        }else {

            res.send({'response':"User not exist",'res':false});
        }
    
})
app.use(function(req,res,next){
	console.log(req.cookies);
	res.cookie('authtoken',req.cookies.authtoken, {maxAge : 9999 ,'domain' : ''})
	next();
})
app.use(jwtcheck);
app.use(function(req, res,next){
   
    proxy.web(req, res, {
      target: 'http://127.0.0.1:3000'
    })
  });
var http = require('http').createServer(app);
http.listen(8080);



function getuser(email){
	for(x in sampledatabase){
		if (sampledatabase[x].username == email)
			return sampledatabase[x];
	}
	return null;
}

function updateUser(email,sessionid){
	for(x in sampledatabase){
		if (sampledatabase[x].username == email)
		{
			if(sampledatabase[x].sessionid)
			sampledatabase[x].sessionid.push(sessionid);
			else {
				sampledatabase[x].sessionid =[];
				sampledatabase[x].sessionid.push(sessionid);
			}
		}
	}
	return null;
}

'created','path','args','exposedports','environment','publishall','ports','hostname','ipaddress','cmd' ,'entrypoint','bindings','volumes','sysinitpath','state']

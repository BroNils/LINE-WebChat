/*

| [ LINE Web Chat - by GoogleX ]
| 
| Special thanks to:
|  - StackoverFlow
|  - Bootstrap snippets
|
| Copyright (c) 2018


*/

console.info("\n\
----         --------  ----    ---- ------------ \n\
****         ********  *****   **** ************ \n\
----           ----    ------  ---- ----         \n\
****           ****    ************ ************ \n\
----           ----    ------------ ------------ \n\
************   ****    ****  ****** ****         \n\
------------ --------  ----   ----- ------------ \n\
************ ********  ****    **** ************ \n\
                                                 ");
console.info("\nNOTE : This project is purely made by @GoogleX !\n\
***Copyright belongs to the author***\n\n\n\n");

/* Const variable */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const unirest = require('unirest');
const qrcode = require('qrcode-terminal');
const util = require("util");
const mime = require("mime");
const path = require('path');
const rp = require('request-promise');
const request = require('request');
const qrimg = require('qr-image');
const LineService = require('./gen/TalkService.js');
const jsonfile = require('jsonfile');
const TTypes = require('./gen/line_types');


/* GLOBAL Var */

var thrift = require('thrift-http');
var xtes = "getAuthQrcode";
var fs = require('fs');
var config = require('./src/config');
var reqx = new TTypes.LoginRequest();
var axy = axz = axc = false;
var TauthService,Tclient,connection,Tcustom = {},xsess,objsess = {},revision,xry,profile = {};
var options = {
    protocol: thrift.TCompactProtocol,
    transport: thrift.TBufferedTransport,
    headers: config.Headers,
    path: config.LINE_HTTP_URL,
    https: true
};


/* Function */

function ambilKata(params, kata1, kata2){
    if(params.indexOf(kata1) === false) return false;
    if(params.indexOf(kata2) === false) return false;
    let start = params.indexOf(kata1) + kata1.length;
    let end = params.indexOf(kata2, start);
    let returns = params.substr(start, end - start);
    return returns;
}

function checkUpdate(){
	unirest.get(config.raw_repo+'version.txt').end(function(data){
		if(config.version != parseFloat(data.body)){
			console.info('There are new version of LINE WebChat \n-> '+config.repo+' ('+parseFloat(data.body)+')')
		}else{
			console.info('You are currently using the latest version ! ^_^')
		}
	})
}

function userlist(dirname, callback) {
	let xret = "<br>",i = 0;
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      callback(err);
      return;
    }
    filenames.forEach(function(filename) {
      i++;
	  xret += i+". "+filename.replace(".txt","")+"<br>";
    });
	callback(xret);
  });
}

function timer(fname){
	fs.unlinkSync(path.resolve("./user-list/"+fname.replace(/[^a-z0-9]/gi, '_')+".txt"))     
}

function storedJSON(paths,callback){
	let xstor;
	if (fs.existsSync(path.resolve(paths))) {
    fs.readFile(path.resolve(paths), (err, data) => {
        if (err) throw err;
        //xstor = JSON.parse(data);
		callback(data);
    });
    } else {
		xstor = {error:"NO_FILE"};
		callback('NOTFOUND');
	}
}

function saveJSON(paths,data,callback){
	jsonfile.writeFile(paths, data, function(err) {
    	if(err) {
       	 return console.log(err);
    	}

    	callback("DONE");
	}); 
}

function setTHttpClient(xoptions = {
    protocol: thrift.TCompactProtocol,
    transport: thrift.TBufferedTransport,
    headers: config.Headers,
    path: config.LINE_HTTP_URL,
    https: true
  },callback,xcustom="none",tpath) {
	xoptions.headers['X-Line-Application'] = 'DESKTOPWIN\t7.18.1\tFDLRCN\t11.2.5';
    connection =
      thrift.createHttpConnection(config.LINE_DOMAIN_3RD, 443, xoptions);
    connection.on('error', (err) => {
      console.log('err',err);
      return err;
    });
	if(axy === true){
		TauthService = thrift.createHttpClient(require('./gen/AuthService.js'), connection);axy = false;
		callback("DONE");
	} else if (axc === true){
		eval(`Tcustom.${xcustom} = thrift.createHttpClient(require('./gen/${tpath}.js'), connection);`);axc = false;
		callback("DONE");
	} else {
		Tclient = thrift.createHttpClient(LineService, connection);
		callback("DONE");
	}
    
}

function authConn(callback){
	axy = true;
	options.path = config.LINE_RS;
    setTHttpClient(options,(xres) => {
		if(xres == "DONE"){
			callback("DONE");
		}
	});
}

function serviceConn(path,xcustom,tpath,callback){
	axc = true;
	options.path = path;
    setTHttpClient(options,(xres) => {
		if(xres == "DONE"){
			callback("DONE");
		}
	},xcustom,tpath);
}

function getQrLink(callback) {
	options.path = config.LINE_HTTP_URL;
    setTHttpClient(options,(xres) => {
		if(xres == "DONE"){
   			 Tclient.getAuthQrcode(true, "WBCHT",(err, result) => {
    		  // console.log('here')
			  console.log(err)
     		 const qrcodeUrl = `line://au/q/${result.verifier}`;
			callback(qrcodeUrl,result.verifier);
    		});
		}
	});
}

function qrLogin(xverifier,callback){
	Object.assign(config.Headers,{ 'X-Line-Access': xverifier });
        unirest.get('https://gd2.line.naver.jp/Q')
          .headers(config.Headers)
          .timeout(120000)
          .end(async (res) => {
            const verifiedQr = res.body.result.verifier;
			authConn((xret) => {
			if(xret == "DONE"){
			reqx.type = 1;
			reqx.verifier = verifiedQr;
			reqx.systemName = "WBCHT";
			reqx.identityProvider = 1;
			reqx.e2eeVersion = 0;
			TauthService.loginZ(reqx,(err,success) => {
				console.info("err=>"+err);
					//console.info(JSON.stringify(success));
				config.tokenn = success.authToken;
				config.certificate = success.certificate;
				let xdata = {
					authToken: success.authToken,
					certificate: success.certificate
				}
				callback(xdata);
			});}
			});
          });
}

function doTalkServiceGET(xfunc,xparams,xlength,xtype = 'JSON.stringify',xservice = 'talkservice',callback){
	if(xsess.isLoggedIn === true){
		if(typeof Tcustom !== 'undefined' && Tcustom){
			switch(xlength){
				case 0:
				    eval(`Tcustom.${xservice}[xfunc]((err,success)=>{
						if(err){callback(err)}else{callback(${xtype}(success))}
					})`);
				break;
				case 1:
				    eval(`Tcustom.${xservice}[xfunc](xparams[0],(err,success)=>{
						if(err){callback(err)}else{callback(${xtype}(success))}
					})`);
				break;
				case 2:
				    eval(`Tcustom.${xservice}[xfunc](xparams[0],xparams[1],(err,success)=>{
						if(err){callback(err)}else{callback(${xtype}(success))}
					})`);
				break;
				case 3:
				    eval(`Tcustom.${xservice}[xfunc](xparams[0],xparams[1],xparams[2],(err,success)=>{
						if(err){callback(err)}else{callback(${xtype}(success))}
					})`);
				break;
				case 4:
				    eval(`Tcustom.${xservice}[xfunc](xparams[0],xparams[1],xparams[2],xparams[3],(err,success)=>{
						if(err){callback(err)}else{callback(${xtype}(success))}
					})`);
				break;
				case 5:
				    eval(`Tcustom.${xservice}[xfunc](xparams[0],xparams[1],xparams[2],xparams[3],xparams[4],(err,success)=>{
						if(err){callback(err)}else{callback(${xtype}(success))}
					})`);
				break;
				case 6:
				    eval(`Tcustom.${xservice}[xfunc](xparams[0],xparams[1],xparams[2],xparams[3],xparams[4],xparams[5],(err,success)=>{
						if(err){callback(err)}else{callback(${xtype}(success))}
					})`);
				break;
				case 7:
				    eval(`Tcustom.${xservice}[xfunc](xparams[0],xparams[1],xparams[2],xparams[3],xparams[4],xparams[5],xparams[6],(err,success)=>{
						if(err){callback(err)}else{callback(${xtype}(success))}
					})`);
				break;
				case 8:
				    eval(`Tcustom.${xservice}[xfunc](xparams[0],xparams[1],xparams[2],xparams[3],xparams[4],xparams[5],xparams[6],xparams[7],(err,success)=>{
						if(err){callback(err)}else{callback(${xtype}(success))}
					})`);
				break;
				default:
				    callback('Request too long');
			}
		}else{callback('No thrift connection')}
	}else{callback('Unauthorized user')}
}

function realClassGET(xarray,callback){
	let narray = xarray;
	xarray.forEach(function(entry, i){
		if(entry.match(/objsess/g) != null){
			eval("narray["+i+"] = "+xarray[i]+";");
		}
	});
	callback(narray);
}

function defineObjectVarGET(xobj,xparams,callback){
	let defchar,defvar;
	xparams.forEach(function(entry, i){
		defchar = xparams[i].split(".");
		defvar = xparams[i].substr(xparams[i].indexOf('.')+1);
		eval(xobj+'.'+defchar[0]+' = `${defvar}`;');
	});
	callback("DONE");
}

function saveRevision(xrevision){
	let xcont = {"revision":xrevision};
	fs.writeFile("./data/revision.json", JSON.stringify(xcont), function(err) {
        //if(err) {callback(err)}else{callback("DONE")}
	}); 
}

function renewGroupList(callback){
	let xdat = [];
	if(xsess.isLoggedIn === true){
		if(typeof Tcustom.talkservice !== 'undefined' && Tcustom.talkservice){
			Tcustom.talkservice.getGroupIdsJoined((err,success)=>{
				Tcustom.talkservice.getGroups(success,(xerr,res)=>{
					console.info(xerr);
					for(var i = 0; i < res.length;i++){
						xdat[i] = {};
						xdat[i].id = res[i].id;
						xdat[i].createdTime = parseInt(res[i].createdTime);
						xdat[i].name = res[i].name;
						xdat[i].pictureStatus = res[i].pictureStatus;
						xdat[i].preventJoinByTicket = res[i].preventJoinByTicket;
						xdat[i].groupPreference = {};
						xdat[i].groupPreference.invitationTicket = res[i].groupPreference.invitationTicket;
						xdat[i].groupPreference.favoriteTimestamp = parseInt(res[i].groupPreference.favoriteTimestamp);
						//xdat[i].creator = {};
						//xdat[i].creator.mid = res.creator.mid;
						xdat[i].picturePath = res[i].pictureStatus;
						xdat[i].memberCount = res[i].members.length;
					}
					saveJSON("./data/groups.json",xdat,(xret)=>{
						callback(xret);
					})
					//setTimeout(function(){console.info(xdat)},20000);
				    /*setTimeout(function(){saveJSON("./data/groups.json",xdat,(xret)=>{
						callback(xret);
					})},20000);*/
				})
			})
		}else{callback('No thrift connection')}
	}else{callback('Unauthorized user')}
}

function buildHTMLFriends(xdomain,type,callback){
	let xhtml,xdat,xdats,gpic;
	unirest.get('http://'+xdomain+'/'+type+'.json').end(function (response) {
	  xdat = response.body;
	  for(var i = 0;i<xdat.length;i++){
		  gpic = config.LINE_DL_PROFILE+xdat[i].picturePath;
		  if(xdat[i].picturePath == null){
			  gpic = '../images/line.png';
		  }
		  xdats = xdat[i];
		  if(i==0){
			xhtml = '<div class="friend"><input id="friendid" type="hidden" value="'+xdats.id+'"><img src="'+gpic+'"><p><strong>'+xdats.name+'</strong><span> ('+xdats.memberCount+')</span></p><div class="status available"></div></div>';  
		  }else{
			xhtml += '<div class="friend"><input id="friendid" type="hidden" value="'+xdats.id+'"><img src="'+gpic+'"><p><strong>'+xdats.name+'</strong><span> ('+xdats.memberCount+')</span></p><div class="status available"></div></div>';
		  }
	  }
	  callback(xhtml);
    });
}

function replaceUnicode(string, to = ''){
	if(string != null){
		return string.replace(/\\u..../g,to);
	}else{
		return string;
	}
}

function padWithLeadingZeros(string) {
    return new Array(5 - string.length).join("0") + string;
}

function unicodeCharEscape(charCode) {
    return "\\u" + padWithLeadingZeros(charCode.toString(16));
}

function unicodeEscape(string) {
    return string.split("")
                 .map(function (char) {
                     var charCode = char.charCodeAt(0);
                     return charCode > 127 ? unicodeCharEscape(charCode) : char;
                 })
                 .join("");
}

function toAscii(src,callback) {
    var ch, str, i, result = {};
	
	if(src.param1 != null){
	src.param1 = unicodeEscape(src.param1);
	}
	
	if(src.param2 != null){
	src.param2 = unicodeEscape(src.param2);
	}
	
	if(src.param3 != null){
	src.param3 = unicodeEscape(src.param3);
	}
	
	if(src.message != null){
		if(src.message.text != null){
	        src.message.text = unicodeEscape(src.message.text);
		}
	}
	
	callback(src);
}

function addDislayName(src,callback){
	Tcustom.talkservice.getContact(src.message._from,(err,success)=>{
		src.message.displayName = replaceUnicode(unicodeEscape(success.displayName));
		src.message.picturePath = config.LINE_DL_PROFILE+success.picturePath;
		callback(src);
	})
}

function rebuildChat(xdomain,callback){
	let xrevision;
	if (fs.existsSync(path.resolve('./data/revision.json'))) {
	    fs.readFile('./data/revision.json', function read(err, data) {
	      xrevision = JSON.parse(data);
	      Tcustom.talkservice.fetchOps(xrevision.revision,10,0,0,(err,success)=>{
		      for(var i = 0; i < success.length;i++){
				  if(success[i].type == 25 || success[i].type == 26){
				  toAscii(success[i],(retx)=>{
					  addDislayName(retx,(resultx)=>{
						  arrangeOp(xdomain,resultx);
					  })
				  })
				  }else{console.info("notmsg")
				  toAscii(success[i],(retx)=>{
					  arrangeOp(xdomain,retx);
				  })
				  }
			  }
			  if(parseInt(success[success.length-1].revision) != -1){
				  profile.revision = parseInt(success[success.length-1].revision);
			      saveRevision(parseInt(success[success.length-1].revision));
			  }
			  callback("DONE");
	      })
        });
	}else{
		Tcustom.talkservice.getLastOpRevision((err,result)=>{
			profile.revision = parseInt(result);
			saveRevision(parseInt(result));
			callback("DONE");
		})
	}
}

function arrangeOp(xdomain,operations){
	let xdat = new Array(),msg,id,to;
	if(operations.type == 25 || operations.type == 26){
		msg = operations.message;
		id = msg.id;
		to = msg.to;
		msg.type = operations.type;
		msg.createdTime = parseInt(msg.createdTime);
		msg.deliveredTime = parseInt(msg.deliveredTime);
		msg.text = replaceUnicode(msg.text);
		if (fs.existsSync(path.resolve('./data/'+to+'.json'))) {
			unirest.get('http://'+xdomain+'/'+to+'.json').end(function (response) {
				for(var i = 0;i < response.body.length; i++){
					if(response.body[i].id == id){
						console.info("NO_CHANGE");
						break;
					}else if(i == response.body.length-1){
						response.body[response.body.length] = msg;
						saveJSON('./data/'+to+'.json',response.body,()=>{
							console.info(to);
							console.info("saved");
						})
						break;
					}
				}
				//setTimeout(saveJSON(),5000);
			})
		}else{
			xdat[0] = msg;
			saveJSON('./data/'+to+'.json',xdat,()=>{
				console.info("saved");
			})
		}
	}else if(operations.type == 13 || operations.type == 65 || operations.type == 32 || operations.type == 19){
		msg = new TTypes.Message();
		msg.type = operations.type;
		msg.person = operations.param2;
		msg.person2 = operations.param3;
		if(msg.person && msg.person2 && msg.person != null && msg.person2 != null){
		Tcustom.talkservice.getContacts([msg.person,msg.person2],(err,s)=>{
			msg.personName = replaceUnicode(unicodeEscape(s[0].displayName));
			msg.personName2 = replaceUnicode(unicodeEscape(s[1].displayName));
			msg.id = parseInt(operations.revision);
			msg.to = operations.param1;
			id = msg.id;
			to = operations.param1;
			console.info(to);
			if (fs.existsSync(path.resolve('./data/'+to+'.json'))) {
				unirest.get('http://'+xdomain+'/'+to+'.json').end(function (response) {
					for(var i = 0;i < response.body.length; i++){
						if(response.body[i].id == id){
							console.info("NO_CHANGE");
							break;
						}else if(i == response.body.length-1){
							response.body[response.body.length] = msg;
							saveJSON('./data/'+to+'.json',response.body,()=>{
								console.info(to);
								console.info("saved");
							})
							break;
						}
					}
				//setTimeout(saveJSON(),5000);
				})
			}else{
				xdat[0] = msg;
				saveJSON('./data/'+to+'.json',xdat,()=>{
					console.info("saved");
				})
			}
		})}
	}else if(operations.type == 11 || operations.type == 60 || operations.type == 15 || operations.type == 17){
		msg = new TTypes.Message();
		msg.type = operations.type;
		msg.person = operations.param2;
		msg.person2 = operations.param3;
		Tcustom.talkservice.getContact(msg.person,(err,s)=>{
			msg.personName = replaceUnicode(unicodeEscape(s.displayName));
			msg.id = parseInt(operations.revision);
			msg.to = operations.param1;
			id = msg.id;
			to = operations.param1;
			console.info(to);
			if (fs.existsSync(path.resolve('./data/'+to+'.json'))) {
				unirest.get('http://'+xdomain+'/'+to+'.json').end(function (response) {
					for(var i = 0;i < response.body.length; i++){
						if(response.body[i].id == id){
							console.info("NO_CHANGE");
							break;
						}else if(i == response.body.length-1){
							response.body[response.body.length] = msg;
							saveJSON('./data/'+to+'.json',response.body,()=>{
								console.info(to);
								console.info("saved");
							})
							break;
						}
					}
				//setTimeout(saveJSON(),5000);
				})
			}else{
				xdat[0] = msg;
				saveJSON('./data/'+to+'.json',xdat,()=>{
					console.info("saved");
				})
			}
		})
	}else if(operations.type == 18 || operations.type == 14 || operations.type == 12 || operations.type == 64 || operations.type == 16 || operations.type == 31 || operations.type == 10){
		msg = new TTypes.Message();
		msg.type = operations.type;
		msg.person = operations.param2;
		msg.id = parseInt(operations.revision);
		msg.to = operations.param1;
		msg.person2 = operations.param3;
		id = msg.id;
		to = operations.param1;
		console.info(to);
		if (fs.existsSync(path.resolve('./data/'+to+'.json'))) {
			unirest.get('http://'+xdomain+'/'+to+'.json').end(function (response) {
				for(var i = 0;i < response.body.length; i++){
					if(response.body[i].id == id){
						console.info("NO_CHANGE");
						break;
					}else if(i == response.body.length-1){
						response.body[response.body.length] = msg;
						saveJSON('./data/'+to+'.json',response.body,()=>{
							console.info(to);
							console.info("saved");
						})
						break;
					}
				}
				//setTimeout(saveJSON(),5000);
			})
		}else{
			xdat[0] = msg;
			saveJSON('./data/'+to+'.json',xdat,()=>{
				console.info("saved");
			})
		}
	}
}

function getOprationType(operations) {
    for (let key in OpType) {
        if(operations.type == OpType[key]) {
            if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                console.info(`[* ${operations.type} ] ${key} `);
            }
        }
    }
}

/* GK JELAS */
function refreshOp(xrevision = 0,lcount = 0){
	console.info("refresh")
	if(typeof xsess !== 'undefined' && xsess){
	if(xsess.isLoggedIn === true){
		if(xrevision == 0){
		Tcustom.talkservice.getLastOpRevision((err,result)=>{
			xrevision = result;
			for(var i = 0;i < lcount;i++){
				Tcustom.talkservice.fetchOps(xrevision,5,0,0,(err,success)=>{
					for (var ixy = 0; ixy < success.length; ixy++) {
						if(success[ixy].revision.toString() != -1){
							if(parseInt(success[ixy].revision.toString()) == parseInt(xrevision) /*|| parseInt(success[op].revision.toString()) == parseInt(xrevision)*/){break;}
							xrevision = success[ixy].revision.toString();
							getOprationType(success[ixy]);
							saveRevision(xrevision)
						}
					}
				})
			}
		})}else{
		for(var i = 0;i < lcount;i++){
			Tcustom.talkservice.fetchOps(xrevision,5,0,0,(err,success)=>{
				for (var ixy = 0; ixy < success.length; ixy++) {
					if(success[ixy].revision.toString() != -1){
						if(parseInt(success[ixy].revision.toString()) < parseInt(xrevision) /*|| parseInt(success[op].revision.toString()) == parseInt(xrevision)*/){break;}
						xrevision = success[ixy].revision.toString();
						getOprationType(success[ixy]);
						saveRevision(xrevision)
					}
				}
			})
		}}
	}}
}
//


/* Express JS - Web */

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'lineweb'}));
app.set('views', 'pages');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  xsess = req.session;
  if(xsess.isLoggedIn === true){
	  renewGroupList(()=>{
          buildHTMLFriends(req.headers.host,'groups',(xret)=>{
			  console.info("Mid->"+profile.myid);
			  res.render('index',{friends: xret,myid: profile.myid,mypic: profile.mypic});
		  })
	  })
  }else{
    res.redirect('/login/qr');
  }
});

app.get('/console', function (req, res) {
	res.render('terminal');
});

app.get('/logout', function (req, res) {
	xsess = req.session;
	if(xsess.isLoggedIn === true){
		Tcustom = {};
		req.session.destroy();
		xsess = '';
		//res.send("DONE");
		res.redirect('/');
	}else{
		res.send("Unauthorized action");
	}
});

app.get('/:file.json', function (req, res) {
	xsess = req.session;
	//if(xsess.isLoggedIn === true){
	    storedJSON('./data/'+req.params.file+'.json',(xret) => {
			if(xret != "NOTFOUND"){
		    res.setHeader('Content-Type', 'application/json');
			if(xret.indexOf('"relatedMessageServiceCode":null}]') == -1){
				res.send(xret);
			}else{
				let xstr = xret.slice(xret.indexOf('"relatedMessageServiceCode":null}]')+35),xstr2,xstr3;
				
				if(xstr == ''){
					res.send(xret);
				}else{
					xstr2 = xret.indexOf(xstr);
					xstr3 = xret.slice(0,xret.indexOf('"relatedMessageServiceCode":null}]')+35) + xstr.slice(xstr2);
				    res.send(xstr3);
	            }
			}
            }else{
				res.send('FILE_NOT_FOUND');
			}
	    });
	//}else{
		//res.send('Unauthorized user');
	//}
});

app.get('/login/:types', function (req, res) {
	xsess = req.session;
	if(xsess.isLoggedIn === true){
		res.redirect('/');
	}else{
	if(typeof req.params.types !== 'undefined' && req.params.types){
		switch(req.params.types){
			case 'qr':
			    getQrLink((qrcodeUrl,verifier)=>{
					xsess.qrverifier = verifier;
					let qr_svg = qrimg.image(qrcodeUrl, { type: 'png' });
                    qr_svg.pipe(require('fs').createWriteStream('./public/qr-img/loginqr.png'));
					res.render('linkqr', {linkqr: qrcodeUrl,qrimgfile: '../qr-img/loginqr.png'});
				});
			break;
			case 'cred':
			    res.send("soon....");
			break;
			case 'token':
			    res.render('token');
			break;
			default:
			    res.send("Login type not found");
		}
	}else{
		res.send("Login type is null");
	}}
});

app.post('/confirmlogin/:types', function (req, res) {
	xsess = req.session;
	if(xsess.isLoggedIn === true){
		res.redirect('/');
	}else if(xsess.qrverifier){
	if(typeof req.params.types !== 'undefined' && req.params.types){
		switch(req.params.types){
			case 'qr':
			    qrLogin(xsess.qrverifier,(xret)=>{
					xsess.authToken = xret.authToken;
					xsess.isLoggedIn = true;
					options.headers['X-Line-Access'] = xsess.authToken;
					serviceConn(config.LINE_HTTP_URL,"talkservice",'TalkService',(xret)=>{
						if(xret == "DONE"){
							Tcustom.talkservice.getProfile((err,success)=>{
								xsess.myid = success.mid;
								profile.myid = success.mid;
								xsess.myname = success.displayName;
								profile.name = success.displayName;
								xsess.picturePath = success.picturePath;
								profile.mypic = success.picturePath;
								res.redirect('/');
							})
							//res.redirect('/');
						}else{res.send("Could not connect thrift");}
					})
				});
			break;
			case 'cred':
			    res.send("soon....");
			break;
			case 'token':
			    xsess.authToken = req.body.token;
				xsess.isLoggedIn = true;
				options.headers['X-Line-Access'] = xsess.authToken;
				serviceConn(config.LINE_HTTP_URL,"talkservice",'TalkService',(xret)=>{
					if(xret == "DONE"){
						Tcustom.talkservice.getProfile((err,success)=>{
							xsess.myid = success.mid;
							profile.myid = success.mid;
							xsess.myname = success.displayName;
							profile.name = success.displayName;
							xsess.picturePath = success.picturePath;
							profile.mypic = success.picturePath;
							res.redirect('/');
						})
					}else{res.send("Could not connect thrift");}
				})
			break;
			default:
			    res.send("Login type not found");
		}
	}else{
		res.send("Login type is null");
	}}
});

app.get('/sendMessage/:to/:msg', function (req, res) {
	xsess = req.session;
	if(typeof Tcustom.talkservice !== 'undefined' && Tcustom.talkservice){
		if(typeof req.params.to !== 'undefined' && req.params.to){
			let msg = new TTypes.Message();
			msg.to = req.params.to;
			msg.text = req.params.msg;
			Tcustom.talkservice.sendMessage(0,msg,(err,success)=>{
				if (req.accepts('json')) {
                    res.send({ error: err, result: success });
                }else{
				    res.send("Error -> "+err+"<br>Result -> "+JSON.stringify(success));
				}
			})
		}
	}else{
		res.send("No thrift connection");
	}
});

app.use(function(req, res, next){
  xsess = req.session;
  let urlPath = req.url.split("/");// urlPath[0] = null
  switch(urlPath[1].toLowerCase()){
	  case 'client':
	      let xfunc = urlPath[3];
		  let xtype = urlPath[4];
		  let xservice = urlPath[2];
	      urlPath.splice(0,5);
	      realClassGET(urlPath,(xarray)=>{
			  doTalkServiceGET(xfunc,xarray,xarray.length,xtype,xservice,(xret)=>{
			      res.type('txt').send(xret.toString());
		      });
		  })
	  break;
	  case 'newclass':
	      let xname = urlPath[2];
	      eval('objsess.'+xname+' = new TTypes.'+urlPath[3]+'();')
		  urlPath.splice(0,4);
		  defineObjectVarGET('objsess.'+xname,urlPath,(xret)=>{
			  if(xret == "DONE"){
				  eval('res.send(objsess.'+xname+');')
			  }
		  });
	  break;
	  case 'refresh':
	      refreshOp(urlPath[2],urlPath[3])
		  res.send("DONE")
	  break;
	  case 'loadclass':
	      eval('res.send(objsess.'+urlPath[2]+');')
	  break;
	  case 'renew':
	      if(urlPath[2].toLowerCase() == "group"){
			  renewGroupList((xret)=>{
				  res.send(xret);
			  })
		  }else if(urlPath[2].toLowerCase() == "chat"){
			  if(urlPath[3].toLowerCase() == "group"){
				  rebuildChat(req.headers.host,(xret)=>{
				      res.send(xret);
			      })
			  }
		  }else{
			  res.send("Error...");
		  }
	  break;
	  case 'newconn':
	      serviceConn('/'+urlPath[3],urlPath[2],urlPath[4],(xret)=>{
			  res.send(xret);
		  })
	  break;
	  default:
	      if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
          }

          res.type('txt').send('Not found');
  }
});

console.log('\nChecking update....')
  checkUpdate();

app.listen(config.port, function () {
  console.log('\nREADY !\nServer running on 127.0.0.1:1337')
});

process.on('uncaughtException', function (err) {
    console.info("Something make me cry \n"+err);

});

var request = require("request");
var pubnub = require("pubnub");

var relayr = module.exports = {};

var listeners = [];

relayr.connect = function(options){

	getPubNubKeys(options,function(err,data){

		var pubnubkeys = {};

		pubnubkeys.cipher_key = data.cipherKey;
		pubnubkeys.auth_key = data.authKey;
		pubnubkeys.subscribe_key = data.subscribeKey;
		pubnubkeys.channel = data.channel;
		
		listen(pubnubkeys);

	});

};

relayr.listen = function(listener){
	listeners.push(listener);
};

var getPubNubKeys = function(relayrkeys,callback){

	var app_id = relayrkeys.app_id;
	var dev_id = relayrkeys.dev_id;
	var token = relayrkeys.token;

	var options = {
		url:"https://api.relayr.io/devices/"+dev_id+"/apps/"+app_id,
		headers: {'Authorization': 'Bearer ' + token}
	}

	console.log("Retrieving Pubnub Keys");

	request.post(options,function(err,data){
		var pubnubkeys = {};
		if(!err) {
			try {
				pubnubkeys = JSON.parse(data.body);
			} catch(ex) {
				err = ex;
			}
		}
		callback(err,pubnubkeys);
	});

};

var listen = function(pubnubkeys) {
	
	var connection = pubnub.init(pubnubkeys);

	console.log("Connecting to Relayr Sensors");

	connection.subscribe({
		channel  : pubnubkeys.channel,
		callback : function(message) {
			var err = null;
			try {
				message = JSON.parse(message);
			} catch (ex) {
				err = ex;
			}
			listeners.forEach(function(listener){
				listener(err,message);
			});
		},
		error:function(err) {
			console.log("Relayr Error!");
			console.log(err);
		}
	});

};
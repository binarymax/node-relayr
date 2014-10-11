# node-relayr

Relayr sensor SDK for node.

Works by connecting to the PubNub channel associated with your Relayr Wonderbar sensor.

## installation

```
npm install relayr
```

## connecting

Require the module

```js
var relayr = require('relayr');
```

Get the following from your account at relayr.io

```js
var relayrKeys = {
	app_id: "YOURAPPID",
	dev_id: "YOURDEVICEID",
	token:  "YOURSENSORTOKEN"
};
```

Connect using the keys:
```js
relayr.connect(relayrKeys);
```

Listen and do stuff
```js
relayr.listen(function(err,data){
	//fires for every sensor event
	if (err) {
		console.log("Oh No!", err)
	} else {
		console.log(data);
	}
});

```
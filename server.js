var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var mongodbURL = 'mongodb://localhost:27017/test';

var restaurantSchema = require('./models/restaurant');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/restaurant_id/:id', function(req,res){
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
	var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id},function(err,results){
			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				db.close();
				console.log('Found: ',results.length);
				if (results.length ==0) {
					res.json({"message":"No matching document", "restaurant_id": req.params.id});
				}
				else {
					res.json(results);
				}		
			}
		});
	});
});

app.post('/', function(req,res) {
	var name;
	var building;
	var street;
	var zipcode;
	var lon;
	var lat;
	var borough;
	var cuisine;
	var restaurant_id;
	var _id;
	
	name = req.body.name;
	building = req.body.building;
	street = req.body.street;
	zipcode = req.body.zipcode;
	lon = parseFloat(req.body.lon);
	lat = parseFloat(req.body.lat);
	borough = req.body.borough;
	cuisine = req.body.cuisine;
	restaurant_id = req.body.restaurant_id;

	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
	var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var rest = '{'+
		'"address" : {'+
        	'"street": "'+street+'",'+
        	'"zipcode": "'+zipcode+'",'+
        	'"building": "'+building+'",'+
        	'"coord": ['+lon+','+lat+']'+
        	'},'+
    		'"borough": "'+borough+'",'+
    		'"cuisine": "'+cuisine+'",'+
    		'"grades": [],'+
    		'"name": "'+name+'",'+
    		'"restaurant_id": "'+restaurant_id+
		'"}';
		var r = new Restaurant(JSON.parse(rest));
		r.save(function(err,results){
			if (err) {
				res.end(err.message,500);
			}
			else {
				console.log('Insert Done. ' + '_id: '+results["_id"]);
				var result = '{"message":"insert done", "_id":"'+results["_id"]+'"}';
				res.json(JSON.parse(result));
			}
		});
	});
});

app.listen(process.env.PORT || 8099);

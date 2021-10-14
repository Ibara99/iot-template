const mongoose = require('mongoose');

let db_cache = mongoose.connect("mongodb+srv://ibara1010:admin123@cluster0.4gh6a.mongodb.net/test?retryWrites=true&w=majority", { 
	useNewUrlParser: true, useUnifiedTopology: true 
})
						.then(res => console.log("Connected to DB"))
  						.catch(err => console.log(err));
let schema = new mongoose.Schema({
	timestamp : Date,
	temp : Number,
	hum : Number,
  status : {type: String, default: "unidentified"}
})
module.exports = mongoose.model('Iot_riset', schema);
var express = require('express'),
  router = express.Router(),
  path = require('path'), //agar bisa akses root directory
  anomali = require('../plugins/kmeans.js'),
  db = require('../model/dataiot.js');
  
function toTwoDigit(num) {
  if (num<10) return "0"+num;
  return num.toString();
}
function toTimestamp(d) {
  return d.getUTCFullYear()+"-"+toTwoDigit(d.getUTCMonth()+1)+"-"+toTwoDigit(d.getUTCDate())+"T"+toTwoDigit(d.getUTCHours())+":"+toTwoDigit(d.getUTCMinutes())+":"+toTwoDigit(d.getUTCSeconds())+".000Z";
}
// let db = new db_model();

router.route('/').get(function (req, res, next) {
  let params = {}  
  let f = req.query.from;
  let t = req.query.to;
  let lim=99999;
  if (req.query.outlier){
    // stat = "outlier"
    params.status = "outlier"
  }
  if (req.query.limit){
    lim = parseInt(req.query.limit); 
  }
  if (f && t){
    params.timestamp = {$gte: f, $lte:t}
  }
  tmp = db.find(params)
              .limit(lim)
              .sort({"timestamp": -1})
              .exec((err, data) => {
                if (err) {console.log(err)}
                out = [];
                data.forEach((d,i) => {
                  row = {
                    "_id": d._id,
                    "__v": d.__v,
                    "timestamp": d.timestamp,
                    "temp": d.temp,
                    "hum": d.hum,
                    "status": d.status
                  };
                  out.push(row);
                })
                res.json({
                    data: out
                });
              })
  // next();
})

router.route('/mobile').get(function (req, res, next) {
  let params = {};
  let t = new Date();
  let f = new Date(t.getTime() - 8*60*60*1000) 
  params.timestamp = {$gte: toTimestamp(f), $lte:toTimestamp(t)}
  
  tmp = db.find(params)
              .sort({"timestamp": -1})
              .exec((err, data) => {
                if (err) {console.log(err)}
                out = [];
                c = 0;
                data.forEach((d,i) => {
                  row = {
                    "_id": d._id,
                    "__v": d.__v,
                    "timestamp": d.timestamp,
                    "temp": d.temp,
                    "hum": d.hum,
                    "status": d.status
                  };
                  out.push(row);
                  if (d.status == "outlier"){
                    c++;
                  }
                })
                res.json({
                    n: c,
                    data: out
                    
                });
              })
  // next();
})

router.route('/addData').post(function (req,res,next){
  let t = req.body.t,
    h = req.body.h,
    tgl = Date.now(); //timestamp

  let obj = new db({timestamp: tgl, temp: t, hum: h})

  //add to db
  
  obj.save((err, data) => {
    if(err) {
      console.log(err);
      return {status: err};
    }
    console.log(data);
    return {status: "ok"}
  })
  
})

router.route('/addData').get(function (req,res,next){
  let h = req.query.h,
    t = req.query.t,
    tgl = Date.now(); //timestamp
  //console.log("received: "+temp+"-"+hum);

  let obj = new db({timestamp: tgl, temp: h, hum: t})

  //add to db
  
  obj.save((err, data) => {
    if(err) {
      console.log(err);
      return {status: err};
    }
    console.log(data);
    return res.json({status: "ok"})
  })
  
})

router.route('/nOutlier').get(function (req, res, next) {
  let params = {};
  let t = new Date();
  let f = new Date(t.getTime() - 15*60*60*1000) //16 karena 2x8 jam
  params.timestamp = {$gte: toTimestamp(f), $lte:toTimestamp(t)}
  let lim=99999;
  if (req.query.limit){
    lim = parseInt(req.query.limit); 
  }
  
  tmp = db.find(params)
              .limit(lim)
              .sort({"timestamp": -1})
              .exec((err, data) => {
                if (err) {console.log(err)}
                out = [];
                data.forEach((d,i) => {
                  row = {
                    "_id": d._id,
                    "__v": d.__v,
                    "timestamp": d.timestamp,
                    "temp": d.temp,
                    "hum": d.hum,
                    "status": d.status
                  };
                  out.push(row);
                })
                res.json({
                    data: out,
                    n: out.length
                });
              })
  // next();
})

router.route('/elbow').get(function (req, res, next) {
  //harusnya get param di sini untuk get data
  let f = req.query.from;
  let t = req.query.to;
  let batas_k = req.query.k;
  
  //get data
  if (f && t){
    db.find({ timestamp:{
                $gte: f, 
                $lte: t //"2021-06-03T00:00:00.000Z"
              }
            })
      // .limit(lim)
      .sort({"timestamp": -1})
      .exec((err, data) => {
        if (err) console.log(err)
        // data tipenya array[x] = object
        // transformasi data jadi array[array]
        data_trans = []
        data_out = []
        data.forEach((d, c)=>{
          data_trans.push([data[c].timestamp, data[c].temp, data[c].hum])
          row = {
            "_id": d._id,
            "__v": d.__v,
            "timestamp": d.timestamp,
            "temp": d.temp,
            "hum": d.hum,
            "status": d.status
          };
          data_out.push(row);
        })
        if(!batas_k){
          batas_k = data_trans.length - 1;
        }

        let cost_all = [],
            cl_result, c;
        if (data_trans.length>2){
          for (var k=2; k<batas_k; k++) {
            if (k%25 == 0) console.log(k)
            cl_result = anomali.kmeans(data_trans, k);
            c = anomali.cost(cl_result);
            cost_all.push(c)
          }
        }else{
          
        }
        res.json({
          "cost": cost_all,
          "data": data_out
        })
      })
  }
  else
    res.json({"error": "Date Query is not Specified"})
})

router.route('/detekAnomali').get(function (req, res, next) {
  //harusnya get param di sini untuk get data
  // let k = 3; // asumsi k=3; harusnya pake params
  let f = req.query.from;
  let t = req.query.to;
  let k = req.query.k;
  if (!k){
    k = 3
  }
  //asumsi data udah diget dari db
  // data = []
  // for (var i = 0; i < 100; i++) {
  //   data.push({
  //     "timestamp": i-1,
  //     "temp" : i**2,
  //     "hum" : 100-i
  //   })
  // }
  //get data
  if (f && t){
    db.find({ timestamp:{
                $gte: f,//"2021-06-02T00:00:00.000Z", 
                $lte: t //"2021-06-03T00:00:00.000Z"
              }
            })
      // .limit(lim)
      .sort({"timestamp": -1})
      .exec((err, data) => {
        if (err) console.log(err)
        // data tipenya array[x] = object
        //transformasi data jadi array[array]
        data_trans = []
        data.forEach((d, c)=>{
          data_trans.push([data[c].timestamp, data[c].temp, data[c].hum])
        })
        // let cl_result = anomali.kmeans(data_trans, k)
        //   result = anomali.deteksiOutlier(cl_result)
        cl_result = anomali.kmeans(data_trans, k);
        ano_result = anomali.deteksiOutlier(cl_result);
        sil = anomali.silCoef(cl_result);
        res.json({
          "centroid" : cl_result.centroid,
          "threshold": ano_result.threshold,
          "silhouette": sil,
          "result": ano_result.data
        })
      })
  }
  else
    res.json({"error": "Date Query is not Specified"})
})

router.route('/updtAnomali').get(function (req, res, next) {
  //harusnya get param di sini untuk get data
  // let k = 3; // asumsi k=3; harusnya pake params
  let f = req.query.from;
  let t = req.query.to;
  let k = req.query.k;
  if (!k){
    k = 3
  }
  //get data
  if (f && t){
    db.find({ timestamp:{
                $gte: f,//"2021-06-02T00:00:00.000Z", 
                $lte: t //"2021-06-03T00:00:00.000Z"
              }
            })
      .sort({"timestamp": -1})
      .exec((err, data) => {
        if (err) console.log(err)
        // data tipenya array[x] = object
        //transformasi data jadi array[array]
        data_trans = []
        data.forEach((d, c)=>{
          data_trans.push([data[c].timestamp, data[c].temp, data[c].hum])
        })
        if(data_trans.length > 3){
          cl_result = anomali.kmeans(data_trans, k);
          ano_result = anomali.deteksiOutlier(cl_result);
          ano_result.data.forEach((d, i) => {
                db.findOneAndUpdate({timestamp: d.timestamp}, {status: d.status}, {new: true}, (err, dataRes) => {
                  if (err) console.log(err)
                  console.log(dataRes.timestamp);
                })
              })
          res.json({
            "message": "data sedang diupdate..."
          })
        }else{
          res.json({
            "message": "No Data"
          })
        }
      })
  }
  else
    res.json({"error": "Date Query is not Specified"})
})

router.route('/findAndUpdate/:timestamp/:status').get(function(req, res, next) {
  let param = req.params.timestamp,
      stat = req.params.status;
  
  db.findOneAndUpdate({timestamp: param}, {status: stat}, {new: true}, (err, data) => {
    if (err) console.log(err)
    console.log(data);
    res.json({
      result: data
    })
  })
});


module.exports = router;
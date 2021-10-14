//helper
let ObjectEquals = function(object1, object2) {
    //For the first loop, we only check for types
    for (propName in object1) {
        //Check for inherited methods and properties - like .equals itself
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
        //Return false if the return value is different
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        //Check instance type
        else if (typeof object1[propName] != typeof object2[propName]) {
            //Different types => not equal
            return false;
        }
    }
    //Now a deeper check using other objects property names
    for(propName in object2) {
        //We must check instances anyway, there may be a property that only exists in object2
            //I wonder, if remembering the checked values from the first loop would be faster or not 
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof object1[propName] != typeof object2[propName]) {
            return false;
        }
        //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
        if(!object1.hasOwnProperty(propName))
          continue;
        
        //Now the detail check and recursion
        
        //This returns the script back to the array comparing
        /**REQUIRES Array.equals**/
        if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
                   // recurse into the nested arrays
           if (!ArrayEquals(object1[propName], object2[propName]))
                        return false;
        }
        else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
                   // recurse into another objects
                   //console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
           if (!ObjectEquals(object1[propName], object2[propName]))
                        return false;
        }
        //Normal value comparison for strings and numbers
        else if(object1[propName] != object2[propName]) {
           return false;
        }
    }
    //If everything passed, let's say YES
    return true;
}
let ArrayEquals = function (array2, array) {
    // if the other array is a falsy value, return
    if (!array || !array2)
        return false;

    // compare lengths - can save a lot of time 
    if (array2.length != array.length)
        return false;

    for (var i = 0; i < array2.length; i++) {
        // Check if we have nested arrays
        if (array2[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!ArrayEquals(array2[i], array[i]))
                return false;       
        }
        /**REQUIRES OBJECT COMPARE**/
        else if (array2[i] instanceof Object && array[i] instanceof Object) {
            // recurse into another objects
            //console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
            if (!ObjectEquals(array2[i], array[i]))
                return false;
        }           
        else if (array2[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}

let sum = function(array){
  if (array.length == 1) return array[0]
  return array[0] + sum(array.slice(1))
}
let mean = function(array){
  return sum(array)/array.length
}
// $std = sqrt($totdiffer/(sizeof($data)-1));
let std = function(array){
  summed = 0;
  x_ = mean(array);
  array.forEach((x,i) => summed = summed + (x_-x)**2 )
  return (summed/(array.length-1))**0.5
}

let countOut = function(o){
    c_o=0
    c_n=0
    o.forEach((d,i)=>{
        if (d.status == "normal")
            c_n += 1
        else
            c_o += 1
    })
        
    return {"o":c_o, "n":c_n}
}

let convertSal = function(x){
    try{
        return 0.0125*x + 13.50
    }
    catch{
        return x
    }
}
// fungsi kmeansnya
let euclideanDistance = (x,y)=>{
    //"Untuk menghitung jarak antara x dengan y\nx,y: list 1D"
    let tot = 0
    y.forEach((d, i) => {
      tot += (x[i]-y[i])**2
    })
    return tot**0.5
}
let kmeans = (data, k)=>{
  /*
  * data is array; 
  * k is integer
  * output: {
    centroid: array[array];  //nilai tengah cluster
    cluster: array[array] // hasil pengelompokan data
    }
  */
  // init centroid
  let new_centroid = [], 
      centroid = [],
      dist, ind, last, cluster; 
  for (var c=0; c<k; c++) {
    new_centroid.push([data[c][1], data[c][2]])
    centroid.push([0,0])
  }
  
  while(! ArrayEquals(new_centroid, centroid)){
    centroid = new_centroid
    cluster = [] //init cluster
    for (var c=0; c<k; c++){
      cluster.push([])
    }
    
    data.forEach((row)=>{
      for (var c = 0; c < centroid.length; c++) { 
        dist = euclideanDistance(row.slice(1), centroid[c])
        if (c == 0 || dist < last) { //untuk nilai awal || ambil yg lebih kecil
          ind = c;
          last = dist;
        }
      }
      // masukkan data ke cluster terdekat
      cluster[ind].push(row)
    })

    // hitung centroid baru
    new_centroid = []
    cluster.forEach((data_cluster, c)=>{
      tmp = []
      for (var col = 1; col < data[0].length; col++) {
          //cari rata-rata pada setiap col
          tot = 0
          data_cluster.forEach((row)=>{
            tot += row[col]
          }) 
          // jika tidak ada anggota cluster, new_centroid scr default 0; else rata-rata;
          if (tot == 0) 
            tmp.push(0) 
          else 
            tmp.push(tot/data_cluster.length)
      }
      new_centroid.push(tmp)
    })
  }
  return {
    "centroid": new_centroid,
    "cluster": cluster
  }
}
let cost = (res_cl)=>{
  SSE = 0;
  res_cl.cluster.forEach((data, c)=>{
    data.forEach((row)=>{
      tmp = euclideanDistance(row.slice(1), res_cl.centroid[c])
      SSE += tmp **2
    })
  })
  return SSE
}
let deteksiOutlier = (res_cl)=>{
  let dist_all = []
  let data_ = []
  res_cl.cluster.forEach((data, c)=>{
    data.forEach((row)=>{
      tmp = euclideanDistance(row.slice(1), res_cl.centroid[c])
      dist_all.push(tmp)
      data_.push({
        "timestamp": row[0],
        "temp": row[1],
        "hum": row[2],
        "distance": tmp
      })
    })
  })
  let avg = mean(dist_all),
    sigma = std(dist_all),
    threshold = avg + 3*sigma
  // cek outlier
  data_.forEach((d, i) => { //untuk setiap data
    // apabila jarak dengan centroid > threshold: outlier; else otherwise
    let lbl;
    if (d.distance > threshold) 
      lbl = "outlier"
    else 
      lbl = "normal"
    d.status = lbl
  })
  return {
    "threshold": threshold, 
    "data": data_
  }
}
let silhuette = (res_cl)=>{
  score_all = []
  res_cl.cluster.forEach((c1, ic1)=>{
    c1.forEach((data1, i) => {
      d_all = [];
      c1.forEach((data2, j) => {
        if (i != j){
          d_all.push(euclideanDistance(data1.slice(1), data2.slice(1)))
        }
      })
      a = mean(d_all);
      b_all = []
      res_cl.cluster.forEach((c2, ic2)=>{
        if (ic1 != ic2){
          d_all = []
          c2.forEach((data2, j)=>{
            d_all.push(euclideanDistance(data1.slice(1), data2.slice(1)))
          })
          b_all.push(mean(d_all))
        }
      })
      b = Math.min.apply(null, b_all) //karena array, pake .apply(null, var)
      score = (b-a)/Math.max(a,b)
      score_all.push(score)
    })
  })
  return mean(score_all)
}

// init objek untuk eksport
let AnomalyHandler = {};
AnomalyHandler.euclideanDistance = euclideanDistance;
AnomalyHandler.kmeans = kmeans;
AnomalyHandler.cost = cost;
AnomalyHandler.deteksiOutlier = deteksiOutlier;
AnomalyHandler.convertSal = convertSal;
AnomalyHandler.silCoef = silhuette;

//export
module.exports = AnomalyHandler
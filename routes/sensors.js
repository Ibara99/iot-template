var express = require('express'),
  router = express.Router(),
  path = require('path'); //agar bisa akses root directory

router.route('/').get(function (req, res, next) {
  res.send("<script>window.location.replace('./dashboard');</script>")
  // next();
})
router.route('/coba').get(function (req, res, next) {
  res.sendFile(path.resolve("views/json_view.html"))
})

// ini untuk gui
router.route('/login').get(function (req, res, next) {
  if (!req.session.login) {
    res.sendFile(path.resolve("views/login.html"))
  }else{
    res.send("Anda sudah login! Klik <a href='./dashboard'>di sini</a> apabila laman tidak mengalihkan. <script>window.location.replace('./dashboard');</script>")
  }
}).post(function (req, res, next) {
  let pass = req.body.password;
  console.log(pass)
  if (pass == "Adminnya1?"){
    req.session.login = true;
  }

  if (!req.session.login) {
    res.sendFile(path.resolve("views/login.html"))
  }else{
    res.send("Berhasil login! Klik <a href='./dashboard'>di sini</a> apabila laman tidak mengalihkan. <script>window.location.replace('./dashboard');</script>")
  }
})
router.route('/dashboard').get(function (req, res, next) {
  res.sendFile(path.resolve("views/dashboard.html"))
})
router.route('/data').get(function (req, res, next) {
  res.sendFile(path.resolve("views/dataview.html"))
})
router.route('/deteksi-anomali').get(function (req, res, next) {
    res.sendFile(path.resolve("views/outlier.html"))
})
router.route('/backpro').get(function (req, res, next) {
  if (!req.session.login) 
    res.send("Anda belum login!<br> Laman akan mengalihkan anda ke halaman login atau klik <a href='./login'>di sini</a> apabila laman tidak mengalihkan. <script>window.location.replace('./login');</script>")
  else
    res.sendFile(path.resolve("views/backpro.html"))
})
router.route('/sma').get(function (req, res, next) {
  if (!req.session.login) 
    res.send("Anda belum login!<br> Laman akan mengalihkan anda ke halaman login atau klik <a href='./login'>di sini</a> apabila laman tidak mengalihkan. <script>window.location.replace('./login');</script>")
  else
    res.sendFile(path.resolve("views/sma.html"))
})
// sampe sini

router.route('/tes').get(function (req, res, next) {
  res.sendFile(path.resolve("views/plug.html"))
})
router.route('/temp').get(function (req, res, next) {
  res.sendFile(path.resolve("views/template.html"))
})
router.route('/json').get(function (req, res, next) {
  res.json({
    "message": "hello world!"
  })
})

module.exports = router;
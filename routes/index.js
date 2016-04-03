var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get("/clients", function(req,res){
  MongoClient.connect(app.get('dburl'), function(err, db) {
    if(err) throw err;
    ObjectId = mongodb.ObjectID;
    var clients = db.collection('clients');
    clients.find().toArray(function(err, docs) {
      if(err) throw err;
      console.log(err);
      console.log(docs);
      if(docs.length==0){
        res.render('clients', {
          docs: []
        });
      }
      res.render('clients', {
        docs: docs
      });
    });
  });
});

router.post('/clients/new', function(req, res) {
  MongoClient.connect(app.get('dburl'), function(err, db) {
    if(err) throw err;
    var db = req.db;
    var clients = req.db.collection('clients');
    var client = {};
    newclients.name = req.body.name;
    newclients.dateupdated = new Date();
    newclients.datecreated = new Date();
    clients.insert(newpage, function(err, doc) {
      console.log(err);
      if(err){
        res.send("Error adding page. \n"+err)
      }else{
        res.redirect("/clients");
      }
    });
  });
});

router.get('/client/:id', function(req, res){
  MongoClient.connect(app.get('dburl'), function(err, db) {
    if(err) throw err;
    var db = req.db;
    var pages = req.db.collection('pages');
    pages.findOne({ _id: req.ObjectId(req.params.id) },function(err, doc) {
      console.log(doc);
      if(doc._id){
        res.render('client', {doc: doc});
      }else {
        res.send('404. Page not found.');
      }
    });
  });
});

router.get('/forms/:id', function(req, res){
  MongoClient.connect(app.get('dburl'), function(err, db) {
    if(err) throw err;
    var db = req.db;
    var pages = req.db.collection('pages');
    pages.findOne({ _id: req.ObjectId(req.params.id) },function(err, doc) {
      console.log(doc);
      if(doc._id){
        res.render('client', {doc: doc});
      }else {
        res.send('404. Page not found.');
      }
    });
  });
});

module.exports = router;

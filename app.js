var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('my-application');
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// port setup
app.set('port', process.env.PORT || 3000);
//app.set('dburl', "mongodb://user:pass@ds013320.mlab.com:13320/tracking-mongo");
app.set('dburl', "mongodb://localhost:27017/test");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* NEW MONGODB SETUP */
// DOCS ARE HERE https://github.com/mongodb/node-mongodb-native/blob/master/Readme.md
// And
/*
app.use(function (req, res, next){
 MongoClient.connect(app.get('dburl'), function(err, db) {
   if(err) throw err;
   req.db = db;
   req.ObjectId = mongodb.ObjectID;
   next();
 });
});
/* END MONGODB SETUP */
/*
app.use('/', routes);
app.use('/users', users);
*/

app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.get("/clients", function(req,res){
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

app.post('/clients/new', function(req, res) {
  MongoClient.connect(app.get('dburl'), function(err, db) {
    if(err) throw err;
    var clients = db.collection('clients');
    var newclient = {};
    newclient.name = req.body.name;
    newclient.dateupdated = new Date();
    newclient.datecreated = new Date();
    clients.insert(newclient, function(err, doc) {
      console.log(err);
      if(err){
        res.send("Error adding client. \n"+err)
      }else{
        res.redirect("/clients");
      }
    });
  });
});

app.get('/clients/:id', function(req, res){
  MongoClient.connect(app.get('dburl'), function(err, db) {
    if(err) throw err;
    var clients = db.collection('clients');
    clients.findOne({ _id: mongodb.ObjectId(req.params.id) },function(err, doc) {
      console.log(doc);
      if(doc._id){
        res.render('client', {doc: doc});
      }else {
        res.send('404. Page not found.');
      }
    });
  });
});

app.get('/clients/:id/save', function(req, res){
  MongoClient.connect(app.get('dburl'), function(err, db) {
    if(err) throw err;
    var clients = db.collection('clients');
    var saves = db.collection('saves');
    clients.findOne({ _id: mongodb.ObjectId(req.params.id) },function(err, doc) {
      if(doc&&doc._id){
        res.render('form', {doc: doc});
        console.log(doc);
      }else {
        res.render('form', {doc: false});
        console.log("No doc?")
      }
      saves.findOne({ client: mongodb.ObjectId(req.params.id),  },function(err, save) {
        if(save&&save._id){
          res.render('form', {doc: doc});
          console.log(doc);
        }else {
          console.log(save);
          res.render('form', {doc: false, save: save});
          console.log("No doc?")
        }
      });
    });
  });
});

app.post('/clients/:id/save', function(req, res) {
  MongoClient.connect(app.get('dburl'), function(err, db) {
    if(err) throw err;
    if(!req.body.data){
      res.redirect("/dumbass alert")
    }
    var saves = db.collection('saves');
    var clients = db.collection('clients');
    var newsave = {};
    newsave.datecreated = new Date();
    newsave.client = mongodb.ObjectId(req.params.id);
    newsave.data = req.body.data;
    saves.insert(newsave, function(err, doc) {
      if (err) console.log(err);
      if(err){
        res.send("Error adding save. \n"+err)
      }else{
        clients.findOneAndUpdate({ _id: mongodb.ObjectId(req.params.id) }, { $set:{data:req.body.data, curSave: doc._id}},function(err, client) {
          if(err) throw err;
          res.redirect("/clients/"+req.params.id+"/save");
        });
      }
    });
  });
});

app.get('/saves', function(req, res){
  MongoClient.connect(app.get('dburl'), function(err, db) {
    if(err) throw err;
    var saves = db.collection('saves');
    saves.find().toArray(function(err, docs) {
      if(err) throw err;
      console.log(err);
      console.log(docs);
      if(docs.length==0){
        res.render('saves', {
          docs: []
        });
      }
      res.render('saves', {
        docs: docs
      });
    });
  });
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

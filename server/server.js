require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

//simple add todo by passing json with text
app.post('/todos',authenticate, (req, res) => {
  var todo = new Todo({text: req.body.text,_creator:req.user._id});
  //save todo to database
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//get all todos
app.get('/todos',authenticate, (req, res) => {
  Todo.find({
    _creator:req.user._id
  }).then((todos) => {
    res.send({todos})
  }, (e) => {
    res.status(400).send(e);
  });
});

//get particular todo
app.get('/todos/:id',authenticate, (req, res) => {
  var id = req.params.id;
  //check for valid ID
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id:id,
    _creator:req.user._id
  }).then((todo) => {
    //if no data exists for the id
    if (!todo) {
      return res.status(404).send();
    }
    //success
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  })

})


//delete  by id
app.delete('/todos/:id',authenticate,(req,res)=>{
  const id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByOneAndRemove({
    _id:id,
    _creator:req.user._id
  })
  .then((todo)=>{
    if(!todo)
      return res.status(404).send();
    else {
      return res.send({todo});
    }
  })
  .catch((err)=>{
    res.status(400).send();
  });
});

//update todo to compvared
app.patch('/todos/:id',(req,res)=>{
  var id = req.params.id;
  var body = _.pick(req.body,['text'],['compvared']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  if(_.isBoolean(body.compvared) && body.compvared){
    body.compvaredAt = new Date().getTime();
  }else{
    body.compvared = false;
    body.compvaredAt = null;
  }
  Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
    if(!todo)
      return res.status(404).send();
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
});


//Users
app.post('/users',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);
  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});


app.get('/users/me',authenticate,(req,res)=>{
  res.send(req.user);
});

app.post('/users/login',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  User.findByCredentials(body.email,body.password).then((user)=>{
  return user.generateAuthToken().then((token)=>{
    res.header('x-auth',token).send(user);
  });
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.delete("/users/me/token",authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  },()=>{
    res.status(400).send();
  })
});





app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


//for testing
module.exports = {
  app
}

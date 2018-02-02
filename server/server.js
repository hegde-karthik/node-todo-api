
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const jwt = require('jsonwebtoken');

var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

//simple add todo by passing json with text
app.post('/todos', (req, res) => {
  console.log(req.body);
  let todo = new Todo({text: req.body.text});
  //save todo to database
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//get all todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (e) => {
    res.status(400).send(e);
  });
});

//get particular todo
app.get('/todos/:id', (req, res) => {
  let id = req.params.id;
  //check for valid ID
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
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

//delete todo by id
app.delete('/todos/:id',(req,res)=>{
  const id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id)
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

//update todo to completed
app.patch('/todos/:id',(req,res)=>{
  let id = req.params.id;
  let body = _.pick(req.body,['text'],['completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
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
  let body = _.pick(req.body,['email','password']);
  let user = new User(body);
  user.save().then((user)=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })
})
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

//for testing
module.exports = {
  app
}

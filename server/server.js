const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

//simple add todo by passing json with text
app.post('/todos', (req, res) => {
  console.log(req.body);
  let todo = new Todo({
    text: req.body.text
  });
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
    res.send({
      todos
    })
  }, (e) => {
    res.status(400).send(e);
  });
});

//get particular todo
app.get('/todos/:id',(req,res)=>{
  let id = req.params.id;
  //check for valid ID
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo)=>{
    //if no data exists for the id
    if(!todo){
      return res.status(404).send();
    }
    //success
    res.status(200).send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })

})
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

//for testing
module.exports = {
  app
}

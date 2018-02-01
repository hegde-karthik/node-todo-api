const {mongoose} = require('./../server/db/mongoose');
const {Todo} =require('./../server/models/todo');

let id ='5a630566cc25dd243e06f223';

Todo.find({
  _id:id
}).then((todos)=>{
  console.log('todos',todos);
});

Todo.findOne({
  _id:id
}).then((todo)=>{
  if(!todo){
    return console.log('Id not found');
  }
  console.log('todo',todo);
})

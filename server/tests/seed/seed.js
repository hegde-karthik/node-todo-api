const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const oneId = new ObjectID();
const twoId = new ObjectID();

const users = [{
  _id:oneId,
  email:'firstuser@test.com',
  password:'onepass',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:oneId,access:'auth'},process.env.JWT_SECRET).toString()
  }]
},{
  _id:twoId,
  email:'seconduser@test.com',
  password:'twopasss',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:twoId,access:'auth'},process.env.JWT_SECRET).toString()
  }]
}];

const todos = [
  {
    _id: new ObjectID(),
    text: 'first todo',
    _creator:oneId
  }, {
    _id: new ObjectID(),
    text: 'second todo',
    completed:true,
    completedAt:1231231,
    _creator:twoId
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);

  }).then(() => done());
};

const populateUsers= (done)=>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne,userTwo])
  }).then(()=>done())
  .catch((err)=>{
    console.log(err);
  })
}


module.exports = {todos,populateTodos,users,populateUsers};

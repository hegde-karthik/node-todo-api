const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require("./../models/todo");

const todos = [
  {
    _id: new ObjectID(),
    text: 'first todo'
  }, {
    _id: new ObjectID(),
    text: 'second todo',
    completed:true,
    completedAt:12312312
  }
];
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);

  }).then(() => done());
});

describe('Post /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'first todo';

    request(app).post('/todos').send({text}).expect(200).expect((res) => {
      expect(res.body.text).toBe(text);
    }).end((err, res) => {
      if (err)
        return done(err);

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(2);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    })
  });
});

describe("GET /todos", () => {
  it('should get all todos', (done) => {
    request(app).get('/todos').expect(200).expect((res) => {
      expect(res.body.todos.length).toBe(2);
    }).end(done);
  });
});

describe('Delete /todos/:id',()=>{
  it("should remove a todo",(done)=>{
    var id = todos[0]._id.toHexString();

    request(app)
    .delete(`/todos/${id}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(id);
    })
    .end((err,res)=>{
      if(err)
        return done(err);
      Todo.findById(id).then((todo)=>{
        if(todo == null)
          done();
      }).catch((e)=>done(e));

    });
  });

  it("should return 404 if todo was not found",(done)=>{
    var hexId = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });
  it('should return 404 if object id is not valid',(done)=>{

    request(app)
    .delete(`/todos/abc`)
    .expect(404)
    .end(done);
  });
})

describe('Patch /todos/:id',()=>{

  it('should update the todo',(done)=>{
    let id = todos[0]._id.toHexString();

    request(app)
    .patch(`/todos/${id}`)
    .send({completed:true})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.completed).toBe(true);
      //expect(res.body.todo.completedAt).toBe('number');
    })
    .end(done);
  })
  it("should clear completedAt when todo is not completed",(done)=>{
    let id = todos[1]._id.toHexString();

    request(app)
    .patch(`/todos/${id}`)
    .send({completed:false})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBe(null);
    })
    .end(done);
  });
})

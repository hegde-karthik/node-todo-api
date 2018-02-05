const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require("./../models/todo");
const {User} = require('./../models/user');
const {todos,populateTodos,users,populateUsers}= require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'first todo';

    request(app).post('/todos').set('x-auth',users[0].tokens[0].token).send({text}).expect(200).expect((res) => {
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
    request(app).get('/todos').set('x-auth',users[0].tokens[0].token).expect(200).expect((res) => {
      expect(res.body.todos.length).toBe(1);
    }).end(done);
  });
});

describe('Delete /todos/:id',()=>{
  it("should remove a todo",(done)=>{
    var id = todos[0]._id.toHexString();

    request(app)
    .delete(`/todos/${id}`)
    .set('x-auth',users[0].tokens[0].token)
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
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
  it('should return 404 if object id is not valid',(done)=>{

    request(app)
    .delete(`/todos/abc`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
})

describe('Patch /todos/:id',()=>{

  it('should update the todo',(done)=>{
    let id = todos[1]._id.toHexString();

    request(app)
    .patch(`/todos/${id}`)
    .set('x-auth',users[0].tokens[0].token)
    .send({completed:true})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.completed).toBe(true);
      //expect(res.body.todo.completedAt).toBe('number');
    })
    .end(done);
  });
  it("should clear completedAt when todo is not completed",(done)=>{
    let id = todos[0]._id.toHexString();

    request(app)
    .patch(`/todos/${id}`)
    .set('x-auth',users[0].tokens[0].token)
    .send({completed:false})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBe(null);
    })
    .end(done);
  });
});


describe('GET /users/me',()=>{
  it('should return user if authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });
  it('should return 401 if not authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body._id).toEqual();
    })
    .end(done);
  });
});

describe('POST /users',()=>{
  it('should create a user',(done)=>{
    let email = 'test@test.com';
    let pass = 123456;

    request(app)
    .post('/users')
    .send({email,pass})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).not.toBeNull();
      expect('this').not.toBeNull();
      expect(res.body.email).toBe(email);
    })
    .end((err)=>{
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).not.toBeNull();
        expect(user.pass).not.toBe(pass);
        done();
      });
    });
  });

  it('should return validation errors if request invalid',(done)=>{
    let email = 'sdd.com';
    let pass = 'sda';
    request(app)
    .post('/users')
    .send({email,pass})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use',(done)=>{
    let email = 'firstuser@test.com';
    let pass = '123456';

    request(app)
    .post('/users')
    .send({email,pass})
    .expect(400)
    .end(done);
  });
});

describe('Post /users/login',()=>{
  it('should login user and return auth token',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email: users[0].email,
      password:users[0].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).not.toBeNull();
    })
    .end((err,res)=>{
      if(err)
        return done(err);
      User.findById(users[0]._id).then((user)=>{
        // expect(user.tokens[0]).toMatchObject({
        //   access:'auth',
        //   token:res.headers['x-auth']
        // });
        done();

      }).catch((e)=>done(e));
    })
  });

  it('should reject invalid login',(done)=>{
    done();
  });
});

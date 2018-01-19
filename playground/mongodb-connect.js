const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/Users',(err,client)=>{
  var db = client.db('todosdb');
  if(err){
    console.log(`Unable to connect to mongodb server \n ${err}`);
  }
  console.log("connected to MongoDB server");

  // db.collection('Users').insertOne ({
  // Name:'karthik hegde',
  // place:'bangalore',
  // email:'karthikhegde77@gmail.com'
  // },(err,result)=>{
  //   if(err){
  //     return console.log(`Unable to insert \n ${err}`);
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });
  //
  // db.collection('Todos').find().count().then((docs)=>{
  //   console.log(`todos count: ${docs}`);
  // },(err)=>{
  //   console.log(err);
  // })
  client.close();
});

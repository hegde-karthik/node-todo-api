const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
if(process.env.NODE_ENV == "test"){
  mongoose.connect("mongodb://localhost:27017/TodoAppTest" || "mongodb://karthik-hegde:Karto294@ds111478.mlab.com:11478/todoappTest",(err)=>{
    console.log(err);
  });
}
else {
  mongoose.connect("mongodb://localhost:27017/TodoApp" || "mongodb://karthik-hegde:Karto294@ds111478.mlab.com:11478/todoapp",(err)=>{
    console.log(err);
  });
}

module.exports ={
  mongoose
};

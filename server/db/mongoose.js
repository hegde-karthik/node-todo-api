const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://karthik-hegde:Karto294@ds111478.mlab.com:11478/todoapp",(err)=>{
  console.log(err);
});

module.exports ={
  mongoose
};

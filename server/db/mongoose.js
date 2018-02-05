var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, function(error) {
  // Check error in initial connection. There is no 2nd param to the callback.
  console.log(error);
});
module.exports = {mongoose};

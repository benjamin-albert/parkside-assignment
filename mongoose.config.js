var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://parkside:parkside@ds149258.mlab.com:49258/parkside-dev');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = mongoose;

'use strict';

var app = require('./app');

var port = process.env.PORT || 3000;

app.listen(port, function(err) {
  if (err) {
    throw err;
  }

  console.log('Parkside server listening on port', port);
});
var mongoose = require('../mongoose.config');

var Loan = mongoose.model('Loan', mongoose.Schema({
    amount: Number,
    value: Number,
    ssn: String,
    status: Number
}));

module.exports = Loan;
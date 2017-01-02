var mongoose = require('../mongoose.config');

var statusMap = { 0: 'Rejected', 1: 'Accepted' };
var BigNumber = require('bignumber.js');

var Loan = mongoose.Schema({
    amount: Number,
    value: Number,
    ssn: String,
    status: Number
});

Loan.methods.ltvPercent = function() {
    return new BigNumber(this.amount)
        .dividedBy(this.value)
        .times(100);
};

Loan.methods.statusDesc = function() {
    return statusMap[this.status];
};

Loan.methods.commas = function(val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

module.exports = mongoose.model('Loan', Loan);
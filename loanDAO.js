var BigNumber = require('bignumber.js');
var Loan = require('./schemas/loan');

function LoanDAO() {

}

LoanDAO.prototype.save = function(input, cb) {
    // I prefer decimal arithmetic over floating point arithmetic
    // whenever money is involved.
    var approved = 
      new BigNumber(input.amount)
        .dividedBy(input.value)
        .gt(0.4);

    var loan = new Loan({
      amount: input.amount,
      value: input.value,
      ssn: input.ssn,
      status: approved ? 0 : 1
    });

    loan.save(cb);
};

LoanDAO.prototype.find = function(cb) {
  return Loan.find(cb);
};

module.exports = LoanDAO;

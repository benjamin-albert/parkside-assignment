module.exports = function validateLoan(input) {
  var error = {};

  if (!input.amount) {
    error.amount = 'You must enter an amount';
  } else if (Number(input.amount) != input.amount) {
    error.amount = 'Amount must be a number';
  } else if (Number(input.amount) < 1) {
    error.amount = 'You must enter an amount';
  }

  if (!input.value) {
    error.value = 'You must enter a property value';
  } else if (Number(input.value) != input.value) {
    error.value = 'Property value must be a number';
  } else if (Number(input.value) < 1) {
    error.value = 'You must enter a property value';
  }

  if (!error.amount && !error.value && Number(input.amount) > Number(input.value)) {
    error.amount = 'Amount cannot be greater than property value';
  }

  if (!input.ssn) {
    error.ssn = 'You must enter an SSN';
  } else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(input.ssn)) {
    error.ssn = 'You must enter a valid SSN';
  } else {
    var digitGroups = input.ssn.split('-');
    var validGroups = digitGroups.filter(function(group) {
      return !!(group.replace(/0/g, ''));
    });
    
    if (validGroups.length !== 3) {
      error.ssn = 'SSN cannot have a group with just zeros';
    } else if (validGroups[0] >= 900 || validGroups[0] == 666) {
      error.ssn = 'First group cannot start with 666 or 900-999';
    }
  }
  
  return error;
};
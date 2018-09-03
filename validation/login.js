const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = (data) => {
  const errors = {};
  // check fields for non-string empty values like null or undefined
  data.email = !isEmpty(data.email) ? data.email : ''; // eslint-disable-line
  data.password = !isEmpty(data.password) ? data.password : ''; // eslint-disable-line

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

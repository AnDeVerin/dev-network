const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = (data) => {
  const errors = {};

  // check fields for non-string empty values like null or undefined
  data.title = !isEmpty(data.title) ? data.title : ''; // eslint-disable-line
  data.company = !isEmpty(data.company) ? data.company : ''; // eslint-disable-line
  data.from = !isEmpty(data.from) ? data.from : ''; // eslint-disable-line

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Job title field is required';
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company field is required';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

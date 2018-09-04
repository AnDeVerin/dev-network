const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = (data) => {
  const errors = {};

  // check fields for non-string empty values like null or undefined
  data.text = !isEmpty(data.text) ? data.text : ''; // eslint-disable-line

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = 'Post must be between 10 and 300 characters';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

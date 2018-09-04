const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = (data) => {
  const errors = {};

  // check fields for non-string empty values like null or undefined
  data.school = !isEmpty(data.school) ? data.school : ''; // eslint-disable-line
  data.degree = !isEmpty(data.degree) ? data.degree : ''; // eslint-disable-line
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : ''; // eslint-disable-line
  data.from = !isEmpty(data.from) ? data.from : ''; // eslint-disable-line

  if (Validator.isEmpty(data.school)) {
    errors.school = 'School field is required';
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required';
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study is required';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateProfileInput = (data) => {
  const errors = {};

  // check fields for non-string empty values like null or undefined
  data.handle = !isEmpty(data.handle) ? data.handle : ''; // eslint-disable-line
  data.status = !isEmpty(data.status) ? data.status : ''; // eslint-disable-line
  data.skills = !isEmpty(data.skills) ? data.skills : ''; // eslint-disable-line

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to between 2 and 40 characters';
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle field is required';
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  // URL check
  ['website', 'youtube', 'twitter', 'facebook', 'linkedin', 'instagram']
    .forEach((media) => {
      if (!isEmpty(data[media])) {
        if (!Validator.isURL(data[media])) {
          errors[media] = 'Not a valid URL';
        }
      }
    });


  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateProfileInput;

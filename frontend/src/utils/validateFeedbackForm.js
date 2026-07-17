function isBlank(value) {
  return value?.toString()?.trim().length === 0;
}


function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export function validateFeedbackForm(form) {
  const errors = {}

  if (isBlank(form.name)) {
    errors.name = 'feedback.validation.nameRequired';
  }

  if (isBlank(form.email)) {
    errors.email = 'feedback.validation.emailRequired';
  } else if (!isValidEmail(form.email)) {
    errors.email = 'feedback.validation.emailInvalid';
  }

  if (isBlank(form.message)) {
    errors.message = 'feedback.validation.messageRequired';
  }

  return errors;
}

export function hasFeedbackFormErrors(errors) {
  return Object.keys(errors).some(fieldName => Boolean(errors[fieldName]));
}

function isBlank(value) {
  return value?.toString()?.trim().length === 0;
}


function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export function validateLoginForm(form) {
  const errors = {}

  if (isBlank(form.username)) {
    errors.username = 'auth.validation.usernameRequired';
  }

  if (isBlank(form.password)) {
    errors.password = 'auth.validation.passwordRequired';
  }

  return errors;
}


export function validateRegisterForm(form) {
  const errors = {}

  if (isBlank(form.username)) {
    errors.username = 'auth.validation.usernameRequired';
  }

  if (isBlank(form.email)) {
    errors.email = 'auth.validation.emailRequired';
  } else if (!isValidEmail(form.email)) {
    errors.email = 'auth.validation.emailInvalid';
  }

  if (isBlank(form.password)) {
    errors.password = 'auth.validation.passwordRequired';
  } else if (form.password.length < 8) {
    errors.password = 'auth.validation.passwordTooShort';
  }

  if (isBlank(form.password_confirm)) {
    errors.password_confirm = 'auth.validation.passwordConfirmRequired';
  } else if (form.password !== form.password_confirm) {
    errors.password_confirm = 'auth.validation.passwordsDoNotMatch';
  }

  return errors;
}


export function hasAuthFormErrors(errors) {
  return Object.keys(errors).some(fieldName => Boolean(errors[fieldName]));
}

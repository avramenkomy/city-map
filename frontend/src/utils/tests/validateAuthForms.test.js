import { describe, expect, it } from 'vitest';

import {
  hasAuthFormErrors, validateLoginForm, validateRegisterForm
} from '../validateAuthForms';

describe('validateAuthForm', () => {
  describe('validateLoginForm', () => {
    it('test valid data for login form', () => {
      const validForm = { username: 'Ivan', password: 'test-password-123', }
      const errors = validateLoginForm(validForm);

      expect(errors).toEqual({});
    });

    it('requires username', () => {
      const invalidForm = {
        username: '',
        password: 'test-password-123',
      }
      const errors = validateLoginForm(invalidForm);

      expect(errors).haveOwnProperty('username');
      expect(errors.username).toBe('auth.validation.usernameRequired');
    });

    it('requires password', () => {
      const invalidForm = {
        username: 'Ivan',
        password: '     ',
      }
      const errors = validateLoginForm(invalidForm);

      expect(errors).haveOwnProperty('password');
      expect(errors.password).toBe('auth.validation.passwordRequired');
    });
  });

  describe('validateRegisterForm', () => {
    const validForm = {
      username: 'Ivan',
      email: 'ivan@example.com',
      password: 'test-password-123',
      password_confirm: 'test-password-123'
    }

    it('test valid data for register form', () => {
      const errors = validateRegisterForm(validForm);
      expect(errors).toEqual({});
    });

    it ('username requires', () => {
      const invalidForm = { ...validForm, username: '' }
      const errors = validateRegisterForm(invalidForm);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors).haveOwnProperty('username');
      expect(errors.username).toBe('auth.validation.usernameRequired');
    });

    it ('email requires', () => {
      const invalidForm = { ...validForm, email: '' }
      const errors = validateRegisterForm(invalidForm);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors).haveOwnProperty('email');
      expect(errors.email).toBe('auth.validation.emailRequired');
    });

    it ('invalid email', () => {
      const invalidForm = { ...validForm, email: '123' }
      const errors = validateRegisterForm(invalidForm);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors).haveOwnProperty('email');
      expect(errors.email).toBe('auth.validation.emailInvalid');
    });

    it ('password requires', () => {
      const invalidForm = { ...validForm, password: '  ', password_confirm: '' }
      const errors = validateRegisterForm(invalidForm);

      expect(Object.keys(errors).length).toEqual(2);
      expect(errors).haveOwnProperty('password');
      expect(errors).haveOwnProperty('password_confirm');
      expect(errors.password).toBe('auth.validation.passwordRequired');
      expect(errors.password_confirm).toBe('auth.validation.passwordConfirmRequired');
    });

    it ('invalid password', () => {
      const invalidForm = { ...validForm, password: '123' }
      const errors = validateRegisterForm(invalidForm);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors).haveOwnProperty('password');
      expect(errors.password).toBe('auth.validation.passwordTooShort');
    });

    it ('password_confirm requires', () => {
      const invalidForm = { ...validForm, password_confirm: '' }
      const errors = validateRegisterForm(invalidForm);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors).haveOwnProperty('password_confirm');
      expect(errors.password_confirm).toBe('auth.validation.passwordConfirmRequired');
    });

    it ('password do not match', () => {
      const invalidForm = { ...validForm, password_confirm: 'other_password_123' }
      const errors = validateRegisterForm(invalidForm);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors).haveOwnProperty('password_confirm');
      expect(errors.password_confirm).toBe('auth.validation.passwordsDoNotMatch');
    });
  });

  describe('hasAuthFormErrors', () => {
    it ('returns false if empty errors object', () => {
      expect(hasAuthFormErrors({})).toBeFalsy();
    });

    it ('returns true if errors object at least one error exist', () => {
      const errors = { username: 'auth.validation.usernameRequired' }
      expect(hasAuthFormErrors(errors)).toBeTruthy();
    });
  });
});

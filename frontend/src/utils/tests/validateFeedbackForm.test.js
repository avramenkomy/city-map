import { describe, expect, it } from 'vitest';

import { validateFeedbackForm, hasFeedbackFormErrors } from '../validateFeedbackForm';

describe('validateFeedbackForm', () => {
  describe('Feedback form tests', () => {
    const validForm = {
      name: 'Ivan',
      email: 'ivan@example.com',
      message: 'test message',
    }

    it ('returns empty errors object if form is valid', () => {
      expect(validateFeedbackForm(validForm)).toEqual({});
    });

    it ('empty name field test', () => {
      const invalidForm = { ...validForm, name: '' }
      const errors = validateFeedbackForm(invalidForm);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors).haveOwnProperty('name');
      expect(errors.name).toBe('feedback.validation.nameRequired');
    });

    it ('empty email field test', () => {
      const invalidForm = { ...validForm, email: '' }
      const errors = validateFeedbackForm(invalidForm);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors).haveOwnProperty('email');
      expect(errors.email).toBe('feedback.validation.emailRequired');
    });

    it ('invalid email field test', () => {
      const invalidForm = { ...validForm, email: '123asd' }
      const errors = validateFeedbackForm(invalidForm);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors).haveOwnProperty('email');
      expect(errors.email).toBe('feedback.validation.emailInvalid');
    });

    it ('empty message field test', () => {
      const invalidForm = { ...validForm, message: '' }
      const errors = validateFeedbackForm(invalidForm);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors).haveOwnProperty('message');
      expect(errors.message).toBe('feedback.validation.messageRequired');
    });
  });

  describe('hasFeedbackFormErrors', () => {
    it ('returns false if errors object is empty', () => {
      expect(hasFeedbackFormErrors({})).toBeFalsy();
    })

    it ('returns true if errors object at least one erros exist', () => {
      const errors = { username: 'feedback.validation.nameRequired' }
      expect(hasFeedbackFormErrors(errors)).toBeTruthy();
    });
  });
});

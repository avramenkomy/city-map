import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { sendFeedback } from '../api/feedback';

import {
  hasFeedbackFormErrors, validateFeedbackForm
} from '../utils/validateFeedbackForm';

import FieldError from '../components/FieldError';


function FeedbackPage() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [clientErrors, setClientErrors] = useState({});
  const [formErrors, setFormErrors] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);


  function handleFormOnChange(event) {
    const { name, value } = event.target;

    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }));

    setClientErrors(prevState => ({
      ...prevState,
      [name]: null,
    }));

    setFormErrors(prevState => ({
      ...(prevState || {}),
      [name]: null,
    }));

    setIsSent(false);
  }


  function getClientError(fieldName) {
    return clientErrors?.[fieldName] ? t(clientErrors[fieldName]) : null;
  }


  function getBackendError(fieldName) {
    const error = formErrors?.[fieldName];

    if (!error) return null;

    if (Array.isArray(error)) {
      return error.join(' ');
    } else {
      return error.toString();
    }
  }


  function getFieldError(fieldName) {
    return getClientError(fieldName) || getBackendError(fieldName);
  }


  async function handleFormSubmit(event) {
    event.preventDefault();

    const nextClientErrors = validateFeedbackForm(form);
    setClientErrors(nextClientErrors);

    if (hasFeedbackFormErrors(nextClientErrors)) return;

    setIsSending(true);
    setFormErrors(null);
    setIsSent(false);

    try {
      await sendFeedback(form);

      setForm({
        name: '',
        email: '',
        message: '',
      });

      setClientErrors({});

      setIsSent(true);
    } catch (e) {
      if (e.status === 429) {
        setFormErrors({
          non_field_errors: [t('feedback.errors.tooManyRequests')],
        });

        return;
      }

      setFormErrors(e.data || {
        'non_field_errors': [t('feedback.errors.sendFailed')],
      });
    } finally {
      setIsSending(false);
    }
  }

  const nameError = getFieldError('name');
  const emailError = getFieldError('email');
  const messageError = getFieldError('message');

  return (
    <section className="auth-page">
      <h1>{t('feedback.title')}</h1>
      <p>{t('feedback.subtitle')}</p>

      {isSent &&
        <p className="form-success">
          {t('feedback.success')}
        </p>
      }

      <FieldError
        id="feedback-form-error"
        name="non_field_errors"
        getFieldError={getFieldError}
      />

      <form className="auth-form" onSubmit={handleFormSubmit}>
        <label>
          <span>{t('feedback.name')}</span>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleFormOnChange}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? 'feedback-name-error' : undefined}
          />
        </label>

        <FieldError
          id="feedback-name-error"
          name="name"
          getFieldError={getFieldError}
        />

        <label>
          <span>{t('feedback.email')}</span>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleFormOnChange}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'feedback-email-error' : undefined}
          />
        </label>

        <FieldError
          id="feedback-email-error"
          name="email"
          getFieldError={getFieldError}
        />

        <label>
          <span>{t('feedback.message')}</span>

          <textarea
            name="message"
            rows={6}
            value={form.message}
            onChange={handleFormOnChange}
            aria-invalid={Boolean(messageError)}
            aria-describedby={messageError ? 'feedback-message-error' : undefined}
          />
        </label>

        <FieldError
          id="feedback-message-error"
          name="message"
          getFieldError={getFieldError}
        />

        <button
          type="submit"
          disabled={isSending}
        >
          {isSending ? t('feedback.sending') : t('feedback.send')}
        </button>
      </form>
    </section>
  )
}

export default FeedbackPage;

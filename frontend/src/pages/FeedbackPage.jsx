import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { sendFeeback } from '../api/feedback';


function FeedbackPage() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);


  function handleFormOnChange(event) {
    const { name, value } = event.target;

    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }));

    setFormErrors(prevState => ({
      ...(prevState || {}),
      [name]: null,
    }));

    setIsSent(false);
  }


  function getFieldError(fieldName) {
    const error = formErrors?.[fieldName];

    if (!error) return null;

    if (Array.isArray(error)) {
      return error.join(' ');
    } else {
      return error.toString();
    }
  }


  async function handleFormSubmit(event) {
    event.preventDefault();

    setIsSending(true);
    setFormErrors(null);
    setIsSent(false);

    try {
      await sendFeeback(form);

      setForm({
        name: form.name,
        email: form.email,
        message: form.message,
      });

      setIsSent(true);
    } catch (e) {
      setFormErrors(e.data || {
        'non_field_errors': [t('feedback.errors.sendFailed')],
      });
    } finally {
      setIsSending(false);
    }
  }


  return (
    <section className="auth-page">
      <h1>{t('feedback.title')}</h1>
      <p>{t('feedback.subtitle')}</p>

      {isSent &&
        <p className="form-success">
          {t('feedback.success')}
        </p>
      }

      {getFieldError('non_field_error') &&
        <p className="form-error">
          {getFieldError('non_field_errors')}
        </p>
      }

      <form className="auth-form" onSubmit={handleFormSubmit}>
        <label>
          <span>{t('feedback.name')}</span>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleFormOnChange}
          />
        </label>

        {getFieldError('name') &&
          <p className="form-error">
            {getFieldError('name')}
          </p>
        }

        <label>
          <span>{t('feedback.email')}</span>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleFormOnChange}
          />
        </label>

        {getFieldError('email') &&
          <p className="form-error">
            {getFieldError('email')}
          </p>
        }

        <label>
          <span>{t('feedback.email')}</span>

          <textarea
            name="message"
            rows={6}
            value={form.message}
            onChange={handleFormOnChange}
          />
        </label>

        {getFieldError('message') &&
          <p className="form-error">
            {getFieldError('message')}
          </p>
        }

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

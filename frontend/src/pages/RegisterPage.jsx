import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { authStore } from '../stores/authStore';
import {
  validateRegisterForm, hasAuthFormErrors
} from '../utils/validateAuthForms';


function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const fromLocation = location.state?.from;
  const fromPath = fromLocation
    ? `${fromLocation.pathname}${fromLocation.search || ''}`
    : '/';

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [clientErrors, setClientErrors] = useState({});


  function handleChange(event) {
    const { name, value } = event.target;

    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }));

    setClientErrors(prevState => ({
      ...prevState,
      [name]: null,
    }));

    authStore.cleanFormErrors();
  }


  async function handleSubmit(event) {
    event.preventDefault();

    const nextClientErrors = validateRegisterForm(form);
    setClientErrors(nextClientErrors);

    if (hasAuthFormErrors(nextClientErrors)) return;

    const success = await authStore.register(form);

    if (success) navigate(fromPath, { replace: true });
  }


  function getClientError(fieldName) {
    return clientErrors?.[fieldName] ? t(clientErrors[fieldName]) : null;
  }


  function getBackendError(fieldName) {
    const error = authStore.formErrors?.[fieldName];

    if (!error) return null;

    if (Array.isArray(error)) {
      return error.join(' ');
    }

    return error.toString();
  }


  function getFieldError(fieldName) {
    return getClientError(fieldName) || getBackendError(fieldName);
  }

  return (
    <section className="auth-page">
      <h1>{t('pages.register.title')}</h1>
      <p>{t('pages.register.subtitle')}</p>

      {getFieldError('non_field_errors') &&
        <p className="form-error">
          {getFieldError('non_field_errors')}
        </p>
      }

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span>{t('auth.username')}</span>

          <input
            name="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
          />
        </label>

        {getFieldError('username') &&
          <p className="form-error">
            {getFieldError('username')}
          </p>
        }

        <label>
          <span>{t('auth.email')}</span>

          <input
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        {getFieldError('email') &&
          <p className="form-error">
            {getFieldError('email')}
          </p>
        }

        <label>
          <span>{t('auth.password')}</span>

          <input
            name="password"
            type="password"
            autoComplete="password"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        {getFieldError('password') &&
          <p className="form-error">
            {getFieldError('password')}
          </p>
        }

        <label>
          <span>{t('auth.passwordConfirm')}</span>

          <input
            name="password_confirm"
            type="password"
            autoComplete="new-password"
            value={form.password_confirm}
            onChange={handleChange}
          />
        </label>

        {getFieldError('password_confirm') &&
          <p className="form-error">
            {getFieldError('password_confirm')}
          </p>
        }

        <button type="submit" disabled={authStore.loading}>
          {authStore.loading ? t('auth.submitting') : t('auth.register')}
        </button>
      </form>
      <p className="auth-form__hint">
        {t('auth.hasAccount')}{' '}
        <Link to="/login" state={location.state}>
          {t('auth.login')}
        </Link>
      </p>
    </section>
  )
}

export default observer(RegisterPage);

import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { authStore } from '../stores/authStore';

import {
  validateLoginForm, hasAuthFormErrors
} from '../utils/validateAuthForms';

import FieldError from '../components/FieldError';


function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const fromLocation = location.state?.from;
  const fromPath = fromLocation
    ? `${fromLocation.pathname}${fromLocation.search || ''}`
    : '/'

  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [clientErrors, setClientErrors] = useState({});


  function hanldeChange(event) {
    const { name, value } = event.target;

    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));

    setClientErrors(prevState => ({
      ...prevState,
      [name]: null,
    }));

    authStore.cleanFormErrors();
  }


  function getClientError(fieldName) {
    return clientErrors?.[fieldName] ? t(clientErrors[fieldName]) : null;
  }


  function getBackendError(fieldName) {
    const error = authStore.formErrors?.[fieldName];

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


  async function handleSubmit(event) {
    event.preventDefault();

    const nextClientErrors = validateLoginForm(form);
    setClientErrors(nextClientErrors);

    if (hasAuthFormErrors(nextClientErrors)) return;

    const success = await authStore.login(form);

    if (success) navigate(fromPath, { replace: true });
  }

  return (
    <section className="auth-page">
      <h1>{t('pages.login.title')}</h1>
      <p>{t('pages.login.subtitle')}</p>

      <FieldError name="non_field_errors" getFieldError={getFieldError} />

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="">
          <span>{t('auth.username')}</span>

          <input
            name="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={hanldeChange}
          />
        </label>

        <FieldError name="username" getFieldError={getFieldError} />

        <label htmlFor="">
          <span>{t('auth.password')}</span>

          <input
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={hanldeChange}
          />
        </label>

        <FieldError name="password" getFieldError={getFieldError} />

        <button type="submit" disabled={authStore.loading}>
          { authStore.loading ? t('auth.submitting') : t('auth.login') }
        </button>
      </form>

      <p className="auth-form__hint">
        {t('auth.noAccount')}{' '}
        <Link to="/register" state={location.state}>
          {t('auth.register')}
        </Link>
      </p>
    </section>
  )
}

export default observer(LoginPage);

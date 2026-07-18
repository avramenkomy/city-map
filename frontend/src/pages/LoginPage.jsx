import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { authStore } from '../stores/authStore';


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


  function hanldeChange(event) {
    const { name, value } = event.target;

    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    const success = await authStore.login(form);

    if (success) navigate(fromPath, { replace: true });
  }

  return (
    <section className="auth-page">
      <h1>{t('pages.login.title')}</h1>
      <p>{t('pages.login.subtitle')}</p>

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

        {authStore.formErrors?.non_fields_errors &&
          <p className="form-error">
            { authStore.formErrors.non_fields_errors.join(' ') }
          </p>
        }

        <button type="submit" disabled={authStore.loading}>
          { authStore.loading ? t('auth.submitting') : t('auth.login') }
        </button>
      </form>
    </section>
  )
}

export default observer(LoginPage);

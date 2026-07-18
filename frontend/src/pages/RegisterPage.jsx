import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { authStore } from '../stores/authStore';


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


  function handleChange(event) {
    const { name, value } = event.target;

    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    const success = await authStore.register(form);

    if (success) navigate(fromPath, { replace: true });
  }

  return (
    <section className="auth-page">
      <h1>{t('pages.register.title')}</h1>
      <p>{t('pages.register.subtitle')}</p>

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

        {authStore.formErrors?.username && (
          <p className="form-error">
            {authStore.formErrors.username.join(' ')}
          </p>
        )}

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

        {authStore.formErrors?.email && (
          <p className="form-error">
            {authStore.formErrors.email.join(' ')}
          </p>
        )}

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

        {authStore.formErrors?.password && (
          <p className="form-error">
            {authStore.formErrors.password.join(' ')}
          </p>
        )}

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

        {authStore.formErrors?.password_confirm && (
          <p className="form-error">
            {authStore.formErrors.password_confirm.join(' ')}
          </p>
        )}

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

import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { authStore } from '../stores/authStores';

function Layout() {
  const { t } = useTranslation();

  useEffect(() => {
    authStore.loadCurrentUser();
  });

  return (
    <div className="app-shell">
      <header className="site-header">
        <nav className="site-nav" aria-label={t('navigation.label')}>
          <NavLink to="/" end>
            {t('navigation.home')}
          </NavLink>

          <NavLink to="/add-place">
            {t('navigation.addPlace')}
          </NavLink>

          {!authStore.isAuthenticated &&
            <>
              <NavLink to="/login">
                {t('navigation.login')}
              </NavLink>

              <NavLink to="/register">
                {t('navigation.register')}
              </NavLink>
            </>
          }
        </nav>

        <div className="site-header__actions">
          {authStore.isAuthenticated &&
            <div className="user-panel">
              <span className="user-panel__name">
                {authStore.username}
              </span>

              <button
                className="user-panel__button"
                type="button"
                onClick={() => authStore.logout()}
              >
                {t('auth.logout')}
              </button>
            </div>
          }

          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}

export default observer(Layout);

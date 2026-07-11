import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

function Layout() {
  const { t } = useTranslation();

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

          <NavLink to="/login">
            {t('navigation.login')}
          </NavLink>

          <NavLink to="/register">
            {t('navigation.register')}
          </NavLink>
        </nav>

        <div className="site-header__actions">
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

export default Layout;

import { Outlet } from 'react-router-dom';
import classNames from 'classnames';
import Header from '../header/header';
import Footer from '../footer/footer';

import styles from './layout.module.css';
import { useLayoutState } from '../../hooks/use-layout-state';

const Layout = (): JSX.Element => {
  const {
    isMainPage,
    isLoginPage,
    isFavoritesPage,
    isEmpty,
    isFooterNeeded,
    isUnknownAuth,
  } = useLayoutState();

  return (
    <div
      className={classNames('page', styles.page, {
        'page--gray': isMainPage || isLoginPage,
        'page--main': isMainPage,
        'page--login': isLoginPage,
        'page--favorites-empty': isFavoritesPage && isEmpty && !isUnknownAuth,
      })}
    >
      <Header />
      <main
        className={classNames('page__main', styles.main, {
          'page__main--index': isMainPage,
          'page__main--index-empty': isMainPage && isEmpty,
          'page__main--login': isLoginPage,
          'page__main--favorites': isFavoritesPage,
          'page__main--favorites-empty': isFavoritesPage && isEmpty,
          'page__main--offer': !isMainPage && !isLoginPage && !isFavoritesPage && !isFooterNeeded,
        })}
      >
        <Outlet />
      </main>
      {isFooterNeeded && <Footer />}
    </div>
  );
};

export default Layout;

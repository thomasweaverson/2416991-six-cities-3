import { matchPath, Outlet, useLocation } from 'react-router-dom';
import { AppRoute } from '../../const/infrastructure';
import Footer from '../footer/footer';
import Header from '../header/header';
import {
  getContainerModifications,
  getMainElementModifications,
} from './utils';
import { useAppSelector } from '../../hooks';
import { getAuthorizationStatus } from '../../store/slices/user/user.selectors';
import { getOffers } from '../../store/slices/offers/offers.selectors';
import { getFavorites } from '../../store/slices/favorites/favorites.selectors';

import styles from './layout.module.css';

const Layout = (): JSX.Element => {
  const locationPathname = useLocation().pathname;
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  const offersCount = useAppSelector(getOffers).length;
  const favoritesCount = useAppSelector(getFavorites).length;

  const isEmpty = (locationPathname === AppRoute.Root && offersCount === 0) || (locationPathname === AppRoute.Favorites && favoritesCount === 0);

  const isFooterNeeded =
    !matchPath(AppRoute.Root, locationPathname) &&
    !matchPath(AppRoute.Login, locationPathname) &&
    !matchPath(`${AppRoute.Offer}/:id`, locationPathname);

  const containerModifications = getContainerModifications(
    locationPathname,
    authorizationStatus,
    isEmpty
  );

  const mainElementModifications = getMainElementModifications(
    locationPathname,
    isEmpty,
  );

  return (
    <div className={`page ${containerModifications} ${styles.page}`}>
      <Header />
      <main className={`page__main ${mainElementModifications} ${styles.main}`}>
        <Outlet />
      </main>
      {isFooterNeeded && <Footer />}
    </div>
  );
};

export default Layout;

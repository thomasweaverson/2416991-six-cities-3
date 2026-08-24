import { matchPath, useLocation } from 'react-router-dom';
import { useAppSelector } from '.';
import { getAuthorizationStatus } from '../store/slices/user/user.selectors';
import { getOffers } from '../store/slices/offers/offers.selectors';
import { getFavorites } from '../store/slices/favorites/favorites.selectors';
import { AppRoute, AuthorizationStatus } from '../const/infrastructure';


export const useLayoutState = () => {
  const { pathname } = useLocation();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  const offersCount = useAppSelector(getOffers).length;
  const favoritesCount = useAppSelector(getFavorites).length;

  const isMainPage = Boolean(matchPath(AppRoute.Root, pathname));
  const isLoginPage = Boolean(matchPath(AppRoute.Login, pathname));
  const isFavoritesPage = Boolean(matchPath(AppRoute.Favorites, pathname));
  const isOfferPage = Boolean(matchPath(`${AppRoute.Offer}/:id`, pathname));

  const isEmpty =
    (isMainPage && offersCount === 0) ||
    (isFavoritesPage && favoritesCount === 0);

  const isFooterNeeded = !isMainPage && !isLoginPage && !isOfferPage;
  const isUnknownAuth = authorizationStatus === AuthorizationStatus.Unknown;

  return {
    isMainPage,
    isLoginPage,
    isFavoritesPage,
    isEmpty,
    isFooterNeeded,
    isUnknownAuth,
  };
};

import { Route, Routes } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const/infrastructure';
import Favorites from '../../pages/favorites/favorites';
import Login from '../../pages/login/login';
import Main from '../../pages/main/main';
import NotFound from '../../pages/not-found/not-found';
import Offer from '../../pages/offer/offer';
import Layout from '../layout/layout';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Loading from '../../pages/loading/loading';
import ProtectedRoute from '../protected-route/protected-route';
import { getAuthorizationStatus } from '../../store/slices/user/user.selectors';
import { useEffect } from 'react';
import {
  fetchFavoritesAction,
  fetchOffersAction,
} from '../../store/api-actions';

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  useEffect(() => {
    let isMounted = true;

    if (authorizationStatus !== AuthorizationStatus.Unknown) {
      if (isMounted) {
        dispatch(fetchOffersAction());
      }
      if (authorizationStatus === AuthorizationStatus.Auth && isMounted) {
        dispatch(fetchFavoritesAction());
      }
    }

    return () => {
      isMounted = false;
    };
  }, [authorizationStatus, dispatch]);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>6 Cities</title>
      </Helmet>
      <Routes>
        <Route path={AppRoute.Root} element={<Layout />}>
          <Route index element={<Main />} />
          <Route
            path={AppRoute.Login}
            element={
              <ProtectedRoute onlyNoAuth>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route path={`${AppRoute.Offer}/:id`} element={<Offer />} />

          <Route
            path={AppRoute.Favorites}
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route path={AppRoute.NotFound} element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

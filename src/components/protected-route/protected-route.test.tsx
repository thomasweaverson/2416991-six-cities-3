import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './protected-route';
import { withStore } from '../../utils/mock-component';
import { makeFakeStore } from '../../utils/mocks';
import { AppRoute } from '../../const/infrastructure';
import { UserData } from '../../types/user-data';

const fakeUser: UserData = {
  name: 'Thomas',
  email: 'thomas@test.com',
  token: 'token',
  avatarUrl: 'avatar.jpg',
  isPro: false,
};

const PrivatePage = () => <div>Private page</div>;
const LoginPage = () => <div>Login page</div>;
const PublicPage = () => <div>Public page</div>;

describe('Component: ProtectedRoute', () => {
  it('should render children for authorized user', () => {
    const { withStoreComponent } = withStore(
      <ProtectedRoute>
        <PrivatePage />
      </ProtectedRoute>,
      makeFakeStore({
        User: {
          userInfo: fakeUser,
          authorizationStatus: 'AUTH',
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('Private page')).toBeInTheDocument();
  });

  it('should redirect unauthorized user to login page', () => {
    const { withStoreComponent } = withStore(
      <ProtectedRoute>
        <PrivatePage />
      </ProtectedRoute>,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: 'NO_AUTH',
        },
      }),
    );

    render(
      <MemoryRouter initialEntries={[AppRoute.Root]}>
        <Routes>
          <Route path={AppRoute.Root} element={withStoreComponent} />
          <Route path={AppRoute.Login} element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('should redirect authorized user from no-auth route', () => {
    const { withStoreComponent } = withStore(
      <ProtectedRoute onlyNoAuth>
        <PublicPage />
      </ProtectedRoute>,
      makeFakeStore({
        User: {
          userInfo: fakeUser,
          authorizationStatus: 'AUTH',
        },
      }),
    );

    render(
      <MemoryRouter initialEntries={[AppRoute.Login]}>
        <Routes>
          <Route path={AppRoute.Login} element={withStoreComponent} />
          <Route path={AppRoute.Root} element={<PrivatePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Private page')).toBeInTheDocument();
  });

  it('should render children for unauthorized user on no-auth route', () => {
    const { withStoreComponent } = withStore(
      <ProtectedRoute onlyNoAuth>
        <PublicPage />
      </ProtectedRoute>,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: 'NO_AUTH',
        },
      }),
    );

    render(
      <MemoryRouter initialEntries={[AppRoute.Login]}>
        <Routes>
          <Route path={AppRoute.Login} element={withStoreComponent} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Public page')).toBeInTheDocument();
  });

  it('should redirect authorized user to previous page from location.state', () => {
    const previousLocation = { pathname: '/favorites' };

    const { withStoreComponent } = withStore(
      <ProtectedRoute onlyNoAuth>
        <PublicPage />
      </ProtectedRoute>,
      makeFakeStore({
        User: {
          userInfo: fakeUser,
          authorizationStatus: 'AUTH',
        },
      }),
    );

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: AppRoute.Login, state: { from: previousLocation } },
        ]}
      >
        <Routes>
          <Route path={AppRoute.Login} element={withStoreComponent} />
          <Route path="/favorites" element={<div>Favorites page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Favorites page')).toBeInTheDocument();
  });
});

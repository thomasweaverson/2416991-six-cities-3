import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import Layout from './layout';
import { withStore } from '../../utils/mock-component';
import { makeFakeStore } from '../../utils/mocks';
import { AuthorizationStatus } from '../../const/infrastructure';

vi.mock('../header/header', () => ({
  default: () => <header>Header</header>,
}));

vi.mock('../footer/footer', () => ({
  default: () => <footer>Footer</footer>,
}));

describe('Component: Layout', () => {
  const renderLayout = (pathname: string, initialState = makeFakeStore()) => {
    const { withStoreComponent } = withStore(<Layout />, initialState);

    return render(
      <MemoryRouter initialEntries={[pathname]}>
        <Routes>
          <Route element={withStoreComponent}>
            <Route path="*" element={<div>Page content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
  };

  it('should render header and page content', () => {
    renderLayout('/');

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('should not render footer on main page', () => {
    renderLayout('/');

    expect(screen.queryByText('Footer')).not.toBeInTheDocument();
  });

  it('should not render footer on login page', () => {
    renderLayout('/login');

    expect(screen.queryByText('Footer')).not.toBeInTheDocument();
  });

  it('should not render footer on offer page', () => {
    renderLayout('/offer/123');

    expect(screen.queryByText('Footer')).not.toBeInTheDocument();
  });

  it('should render footer on favorites page', () => {
    renderLayout('/favorites');

    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should add empty classes when there are no offers', () => {
    const { container } = renderLayout(
      '/',
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.Auth,
        },
        Offers: {
          offers: [],
          isOffersLoading: false,
          isOffersLoadingError: false,
        },
      }),
    );

    expect(container.querySelector('.page')).toHaveClass(
      'page--gray',
      'page--main',
    );

    expect(container.querySelector('main')).toHaveClass(
      'page__main--index',
      'page__main--index-empty',
    );
  });

  it('should add empty classes when there are no favorites', () => {
    const { container } = renderLayout(
      '/favorites',
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.Auth,
        },
        Favorites: {
          favoriteOffers: [],
          isFavoritesLoading: false,
        },
      }),
    );

    expect(container.querySelector('.page')).toHaveClass(
      'page--favorites-empty',
    );

    expect(container.querySelector('main')).toHaveClass(
      'page__main--favorites',
      'page__main--favorites-empty',
    );
  });
});

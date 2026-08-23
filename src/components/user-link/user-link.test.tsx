import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import UserLink from './user-link';
import { withStore } from '../../utils/mock-component';
import { makeFakeStore, makeFakeOfferPreview } from '../../utils/mocks';
import { AuthorizationStatus, AppRoute } from '../../const/infrastructure';

import styles from './user-link.module.css';

describe('Component: UserLink', () => {
  it('should display user email and number of favorite offers', () => {
    const { withStoreComponent } = withStore(
      <UserLink />,
      makeFakeStore({
        USER: {
          userInfo: {
            name: 'Thomas',
            email: 'thomas@test.com',
            token: 'token',
            avatarUrl: 'avatar.jpg',
            isPro: false,
          },
          authorizationStatus: AuthorizationStatus.Auth,
        },
        FAVORITES: {
          favoriteOffers: [makeFakeOfferPreview(), makeFakeOfferPreview()],
          isFavoritesLoading: false,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('thomas@test.com')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should display user name when email is not provided', () => {
    const { withStoreComponent } = withStore(
      <UserLink />,
      makeFakeStore({
        USER: {
          userInfo: {
            name: 'Thomas',
            email: '',
            token: 'token',
            avatarUrl: 'avatar.jpg',
            isPro: false,
          },
          authorizationStatus: AuthorizationStatus.Auth,
        },
        FAVORITES: {
          favoriteOffers: [],
          isFavoritesLoading: false,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('Thomas')).toBeInTheDocument();
  });

  it('should display default user name when user is not authorized', () => {
    const { withStoreComponent } = withStore(
      <UserLink />,
      makeFakeStore({
        USER: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
        FAVORITES: {
          favoriteOffers: [],
          isFavoritesLoading: false,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should add pro class to avatar wrapper for pro user', () => {
    const { withStoreComponent } = withStore(
      <UserLink />,
      makeFakeStore({
        USER: {
          userInfo: {
            name: 'Thomas',
            email: 'thomas@test.com',
            token: 'token',
            avatarUrl: 'avatar.jpg',
            isPro: true,
          },
          authorizationStatus: AuthorizationStatus.Auth,
        },
        FAVORITES: {
          favoriteOffers: [],
          isFavoritesLoading: false,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByTestId('avatar-wrapper')).toHaveClass(
      styles.avatarWrapperPro,
    );
  });

  it('should not add pro class to avatar wrapper for regular user', () => {
    const { withStoreComponent } = withStore(
      <UserLink />,
      makeFakeStore({
        USER: {
          userInfo: {
            name: 'Thomas',
            email: 'thomas@test.com',
            token: 'token',
            avatarUrl: 'avatar.jpg',
            isPro: false,
          },
          authorizationStatus: AuthorizationStatus.Auth,
        },
        FAVORITES: {
          favoriteOffers: [],
          isFavoritesLoading: false,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByTestId('avatar-wrapper')).not.toHaveClass(
      styles.avatarWrapperPro,
    );
  });

  it('should link to favorites page', () => {
    const { withStoreComponent } = withStore(<UserLink />, makeFakeStore());

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      AppRoute.Favorites,
    );
  });
});

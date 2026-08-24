import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Favorites from './favorites';
import { withHistory, withStore } from '../../utils/mock-component';
import { makeFakeOfferPreview, makeFakeStore } from '../../utils/mocks';

vi.mock('../../components/spinner/spinner', () => ({
  default: () => <div>Spinner</div>,
}));

vi.mock(
  '../../components/empty-favorites-banner/empty-favorites-banner',
  () => ({
    default: () => <div>Empty favorites</div>,
  }),
);

vi.mock('../../components/favorites-list/favorites-list', () => ({
  default: () => <div>Favorites list</div>,
}));

describe('Page: Favorites', () => {
  it('should render spinner while favorites are loading', () => {
    const { withStoreComponent } = withStore(
      <Favorites />,
      makeFakeStore({
        Favorites: {
          favoriteOffers: [],
          isFavoritesLoading: true,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    expect(screen.getByText('Spinner')).toBeInTheDocument();
  });

  it('should render empty favorites page when there are no favorite offers', () => {
    const { withStoreComponent } = withStore(
      <Favorites />,
      makeFakeStore({
        Favorites: {
          favoriteOffers: [],
          isFavoritesLoading: false,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    expect(screen.getByText('Empty favorites')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Favorites (empty)',
      }),
    ).toBeInTheDocument();

    expect(screen.queryByText('Favorites list')).not.toBeInTheDocument();
  });

  it('should render favorites list when favorite offers are available', () => {
    const favoriteOffers = [makeFakeOfferPreview(), makeFakeOfferPreview()];

    const { withStoreComponent } = withStore(
      <Favorites />,
      makeFakeStore({
        Favorites: {
          favoriteOffers,
          isFavoritesLoading: false,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    expect(
      screen.getByRole('heading', {
        name: 'Saved listing',
      }),
    ).toBeInTheDocument();

    expect(screen.getByText('Favorites list')).toBeInTheDocument();
    expect(screen.queryByText('Empty favorites')).not.toBeInTheDocument();
  });

  it('should not render empty state while favorites are loading', () => {
    const { withStoreComponent } = withStore(
      <Favorites />,
      makeFakeStore({
        Favorites: {
          favoriteOffers: [],
          isFavoritesLoading: true,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    expect(screen.getByText('Spinner')).toBeInTheDocument();

    expect(screen.queryByText('Empty favorites')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        name: 'Favorites (empty)',
      }),
    ).not.toBeInTheDocument();
  });
});

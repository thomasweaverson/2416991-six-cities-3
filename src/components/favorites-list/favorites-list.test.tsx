import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import FavoritesList from './favorites-list';
import { withHistory, withStore } from '../../utils/mock-component';
import { makeFakeOfferPreview, makeFakeStore } from '../../utils/mocks';

vi.mock('../favorites-item/favorites-item', () => ({
  default: ({
    city,
    offers,
  }: {
    city: string;
    offers: ReturnType<typeof makeFakeOfferPreview>[];
  }) => (
    <li data-testid="favorites-item">
      <span>{city}</span>
      <span>{offers.length}</span>
    </li>
  ),
}));

describe('Component: FavoritesList', () => {
  it('should render favorite offers grouped by cities', () => {
    const parisOffers = [
      makeFakeOfferPreview('offer-1', 'Paris'),
      makeFakeOfferPreview('offer-2', 'Paris'),
    ];

    const londonOffers = [makeFakeOfferPreview('offer-3', 'Amsterdam')];

    const { withStoreComponent } = withStore(
      <FavoritesList />,
      makeFakeStore({
        Favorites: {
          favoriteOffers: [...parisOffers, ...londonOffers],
          isFavoritesLoading: false,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    const items = screen.getAllByTestId('favorites-item');

    expect(items).toHaveLength(2);

    expect(items[0]).toHaveTextContent('Paris');
    expect(items[0]).toHaveTextContent('2');

    expect(items[1]).toHaveTextContent('Amsterdam');
    expect(items[1]).toHaveTextContent('1');
  });
});

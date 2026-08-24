import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import OffersBoard from './offers-board';
import { withStore } from '../../utils/mock-component';
import {
  makeFakeOfferPreview,
  makeFakeStore,
  makeFakeCity,
} from '../../utils/mocks';
import { DEFAULT_SORT_OPTION } from '../../const/business';

vi.mock('../sort-selector/sort-selector', () => ({
  default: () => <div>Sort selector</div>,
}));

vi.mock('../card-list/card-list', () => ({
  default: ({ offers }: { offers: unknown[] }) => (
    <div data-testid="card-list">{offers.length} offers</div>
  ),
}));

describe('Component: OffersBoard', () => {
  it('should render number of offers and current city', () => {
    const offers = [
      makeFakeOfferPreview(),
      makeFakeOfferPreview(),
      makeFakeOfferPreview(),
    ];

    const city = makeFakeCity('Paris');

    const { withStoreComponent } = withStore(
      <OffersBoard />,
      makeFakeStore({
        App: {
          activeOfferId: null,
          currentCity: city,
          sortOption: DEFAULT_SORT_OPTION,
        },
        Offers: {
          offers,
          isOffersLoading: false,
          isOffersLoadingError: false,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText('3 places to stay in Paris')).toBeInTheDocument();
  });

  it('should use singular form for one offer', () => {
    const offers = [makeFakeOfferPreview()];
    const city = makeFakeCity('Paris');

    const { withStoreComponent } = withStore(
      <OffersBoard />,
      makeFakeStore({
        App: {
          activeOfferId: null,
          currentCity: city,
          sortOption: DEFAULT_SORT_OPTION,
        },
        Offers: {
          offers,
          isOffersLoading: false,
          isOffersLoadingError: false,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText('1 place to stay in Paris')).toBeInTheDocument();
  });

  it('should pass offers to CardList', () => {
    const offers = [makeFakeOfferPreview(), makeFakeOfferPreview()];

    const { withStoreComponent } = withStore(
      <OffersBoard />,
      makeFakeStore({
        Offers: {
          offers,
          isOffersLoading: false,
          isOffersLoadingError: false,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByTestId('card-list')).toHaveTextContent('2 offers');
  });
});

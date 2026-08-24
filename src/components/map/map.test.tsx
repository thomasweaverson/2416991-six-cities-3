import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Map from './map';
import { makeFakeOfferPreview, makeFakeStore } from '../../utils/mocks';
import { withStore } from '../../utils/mock-component';
import { CURRENT_CUSTOM_ICON, DEFAULT_CUSTOM_ICON } from './const';

const addTo = vi.fn();
const setIcon = vi.fn(() => ({
  addTo,
}));

const markerLayer = {
  addTo: vi.fn(),
};

vi.mock('../../hooks/use-map', () => ({
  default: vi.fn(() => ({
    removeLayer: vi.fn(),
  })),
}));

vi.mock('leaflet', async () => {
  const actual = await vi.importActual<typeof import('leaflet')>('leaflet');

  return {
    ...actual,
    layerGroup: vi.fn(() => markerLayer),
    Marker: vi.fn(() => ({
      setIcon,
    })),
  };
});

describe('Component: Map', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should render map container', () => {
    const offer = makeFakeOfferPreview();

    const { withStoreComponent } = withStore(
      <Map city={offer.city} offers={[offer]} />,
      makeFakeStore(),
    );

    render(withStoreComponent);

    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('should create marker for each offer', () => {
    const offers = [
      makeFakeOfferPreview('offer-1'),
      makeFakeOfferPreview('offer-2'),
      makeFakeOfferPreview('offer-3'),
    ];

    const { withStoreComponent } = withStore(
      <Map city={offers[0].city} offers={offers} />,
      makeFakeStore(),
    );

    render(withStoreComponent);

    expect(setIcon).toHaveBeenCalledTimes(3);
    expect(addTo).toHaveBeenCalledTimes(3);
  });

  it('should use current icon for active offer', () => {
    const activeOffer = makeFakeOfferPreview('active-offer');
    const anotherOffer = makeFakeOfferPreview('another-offer');

    const { withStoreComponent } = withStore(
      <Map city={activeOffer.city} offers={[activeOffer, anotherOffer]} />,
      makeFakeStore({
        App: {
          activeOfferId: activeOffer.id,
          currentCity: activeOffer.city,
          sortOption: makeFakeStore().App.sortOption,
        },
      }),
    );

    render(withStoreComponent);

    expect(setIcon).toHaveBeenCalledWith(CURRENT_CUSTOM_ICON);
    expect(setIcon).toHaveBeenCalledWith(DEFAULT_CUSTOM_ICON);
  });
});

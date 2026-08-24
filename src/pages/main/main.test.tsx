import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import Main from './main';
import { withStore } from '../../utils/mock-component';
import {
  makeFakeCity,
  makeFakeOfferPreview,
  makeFakeStore,
} from '../../utils/mocks';
import { setCurrentCity } from '../../store/slices/app/app.slice';
import { City } from '../../types/common';
import { DEFAULT_SORT_OPTION } from '../../const/business';

const selectedCity = makeFakeCity('Paris');

vi.mock('../../components/cities-panel/cities-panel', () => ({
  default: ({
    activeCity,
    onCityClick,
  }: {
    activeCity: string;
    onCityClick: (city: City) => void;
  }) => (
    <button type="button" onClick={() => onCityClick(selectedCity)}>
      City: {activeCity}
    </button>
  ),
}));

vi.mock('../../components/offers-board/offers-board', () => ({
  default: () => <div>Offers board</div>,
}));

vi.mock('../../components/no-places/no-places', () => ({
  default: () => <div>No places</div>,
}));

vi.mock('../../components/error-banner/error-banner', () => ({
  default: () => <div>Error banner</div>,
}));

vi.mock('../../components/spinner/spinner', () => ({
  default: () => <div>Spinner</div>,
}));

vi.mock('../../components/map/map', () => ({
  default: () => <div>Map</div>,
}));

describe('Page: Main', () => {
  it('should render spinner while offers are loading', () => {
    const { withStoreComponent } = withStore(
      <Main />,
      makeFakeStore({
        Offers: {
          offers: [],
          isOffersLoading: true,
          isOffersLoadingError: false,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('Spinner')).toBeInTheDocument();
    expect(screen.queryByText('No places')).not.toBeInTheDocument();
    expect(screen.queryByText('Offers board')).not.toBeInTheDocument();
  });

  it('should render error when loading offers failed', () => {
    const { withStoreComponent } = withStore(
      <Main />,
      makeFakeStore({
        Offers: {
          offers: [],
          isOffersLoading: false,
          isOffersLoadingError: true,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('Error banner')).toBeInTheDocument();
    expect(screen.queryByText('Spinner')).not.toBeInTheDocument();
    expect(screen.queryByText('No places')).not.toBeInTheDocument();
  });

  it('should render no places when offers list is empty', () => {
    const { withStoreComponent } = withStore(
      <Main />,
      makeFakeStore({
        Offers: {
          offers: [],
          isOffersLoading: false,
          isOffersLoadingError: false,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('No places')).toBeInTheDocument();
    expect(screen.queryByText('Offers board')).not.toBeInTheDocument();
    expect(screen.queryByText('Map')).not.toBeInTheDocument();
  });

  it('should render offers board and map when offers are available', () => {
    const offers = [makeFakeOfferPreview(), makeFakeOfferPreview()];

    const { withStoreComponent } = withStore(
      <Main />,
      makeFakeStore({
        Offers: {
          offers,
          isOffersLoading: false,
          isOffersLoadingError: false,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('Offers board')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.queryByText('No places')).not.toBeInTheDocument();
    expect(screen.queryByText('Spinner')).not.toBeInTheDocument();
    expect(screen.queryByText('Error banner')).not.toBeInTheDocument();
  });

  it('should change current city when city is clicked', async () => {
    const { withStoreComponent, mockStore } = withStore(
      <Main />,
      makeFakeStore({
        Offers: {
          offers: [],
          isOffersLoading: false,
          isOffersLoadingError: false,
        },
        App: {
          activeOfferId: null,
          currentCity: makeFakeCity('Amsterdam'),
          sortOption: DEFAULT_SORT_OPTION,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('City: Amsterdam')).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', {
        name: 'City: Amsterdam',
      }),
    );

    expect(mockStore.getActions()).toContainEqual(setCurrentCity(selectedCity));
  });
});

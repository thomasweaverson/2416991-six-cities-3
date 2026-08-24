import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NoPlaces from './no-places';
import { withStore } from '../../utils/mock-component';
import { makeFakeStore, makeFakeCity } from '../../utils/mocks';
import { DEFAULT_SORT_OPTION } from '../../const/business';

describe('Component: NoPlaces', () => {
  it('should render current city name', () => {
    const city = makeFakeCity('Paris');

    const { withStoreComponent } = withStore(
      <NoPlaces />,
      makeFakeStore({
        App: {
          activeOfferId: null,
          currentCity: city,
          sortOption: DEFAULT_SORT_OPTION,
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.getByText(
        `We could not find any property available at the moment in ${city.name}`,
      ),
    ).toBeInTheDocument();
  });
});

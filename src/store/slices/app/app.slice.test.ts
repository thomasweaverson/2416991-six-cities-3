import { describe, it, expect } from 'vitest';
import { appSlice, setCurrentCity, setSort, setActiveOfferId } from './app.slice';
import { clearOfferPage } from '../offer/offer.slice';
import { DEFAULT_CITY, DEFAULT_SORT_OPTION, SortOption } from '../../../const/business';
import { City, SortType } from '../../../types/common';

describe('App Slice Reducer', () => {
  const initialState = {
    currentCity: DEFAULT_CITY,
    sortOption: DEFAULT_SORT_OPTION,
    activeOfferId: null,
  };

  it('should return default initial state with empty action and undefined state', () => {
    const emptyAction = { type: '' };

    const result = appSlice.reducer(undefined, emptyAction);

    expect(result).toEqual(initialState);
  });

  describe('reducers', () => {
    it('should change current city with "setCurrentCity" action', () => {
      const mockCity: City = {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      };

      const result = appSlice.reducer(initialState, setCurrentCity(mockCity));

      expect(result.currentCity).toEqual(mockCity);
    });

    it('should change sort option with "setSort" action', () => {
      const targetSort: SortType = SortOption.TopRatedFirst;

      const result = appSlice.reducer(initialState, setSort(targetSort));

      expect(result.sortOption).toBe(targetSort);
    });

    it('should set active offer ID with "setActiveOfferId" action', () => {
      const offerId = 'test-offer-id-123';

      const result = appSlice.reducer(initialState, setActiveOfferId(offerId));

      expect(result.activeOfferId).toBe(offerId);
    });
  });

  describe('extraReducers', () => {
    it('should reset activeOfferId to null when "clearOfferPage" is dispatched', () => {
      const stateWithActiveOffer = {
        ...initialState,
        activeOfferId: 'some-active-id',
      };

      const result = appSlice.reducer(stateWithActiveOffer, clearOfferPage());

      expect(result.activeOfferId).toBeNull();
    });
  });
});

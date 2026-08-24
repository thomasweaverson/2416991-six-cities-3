import { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { useLayoutState } from './use-layout-state';
import { makeFakeOfferPreview, makeFakeStore } from '../utils/mocks';
import { withStore } from '../utils/mock-component';
import { AppRoute, AuthorizationStatus } from '../const/infrastructure';

describe('Hook: useLayoutState', () => {
  const renderLayoutStateHook = (
    pathname: string,
    initialState = makeFakeStore(),
  ) => {
    const { mockStore } = withStore(<div />, initialState);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={[pathname]}>{children}</MemoryRouter>
      </Provider>
    );

    return {
      ...renderHook(() => useLayoutState(), { wrapper }),
      mockStore,
    };
  };

  it('should return correct state for Main page with offers', () => {
    const fakeStore = makeFakeStore({
      Offers: {
        offers: [makeFakeOfferPreview()],
        isOffersLoading: false,
        isOffersLoadingError: false,
      },
    });

    const { result } = renderLayoutStateHook(AppRoute.Root, fakeStore);

    expect(result.current.isMainPage).toBe(true);
    expect(result.current.isLoginPage).toBe(false);
    expect(result.current.isFavoritesPage).toBe(false);
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.isFooterNeeded).toBe(false);
  });

  it('should return isEmpty true on Main page when there are no offers', () => {
    const fakeStore = makeFakeStore({
      Offers: {
        offers: [],
        isOffersLoading: false,
        isOffersLoadingError: false,
      },
    });

    const { result } = renderLayoutStateHook(AppRoute.Root, fakeStore);

    expect(result.current.isMainPage).toBe(true);
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.isFooterNeeded).toBe(false);
  });

  it('should return correct state for Login page', () => {
    const { result } = renderLayoutStateHook(AppRoute.Login);

    expect(result.current.isLoginPage).toBe(true);
    expect(result.current.isMainPage).toBe(false);
    expect(result.current.isFavoritesPage).toBe(false);
    expect(result.current.isFooterNeeded).toBe(false);
  });

  it('should return correct state for Favorites page with items and footer needed', () => {
    const fakeStore = makeFakeStore({
      Favorites: {
        favoriteOffers: [makeFakeOfferPreview()],
        isFavoritesLoading: false,
      },
    });

    const { result } = renderLayoutStateHook(AppRoute.Favorites, fakeStore);

    expect(result.current.isFavoritesPage).toBe(true);
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.isFooterNeeded).toBe(true);
  });

  it('should return isEmpty true on Favorites page when there are no favorites', () => {
    const fakeStore = makeFakeStore({
      Favorites: {
        favoriteOffers: [],
        isFavoritesLoading: false,
      },
    });

    const { result } = renderLayoutStateHook(AppRoute.Favorites, fakeStore);

    expect(result.current.isFavoritesPage).toBe(true);
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.isFooterNeeded).toBe(true);
  });

  it('should return correct state for Offer page with no footer', () => {
    const { result } = renderLayoutStateHook(`${AppRoute.Offer}/123`);

    expect(result.current.isMainPage).toBe(false);
    expect(result.current.isLoginPage).toBe(false);
    expect(result.current.isFavoritesPage).toBe(false);
    expect(result.current.isFooterNeeded).toBe(false);
  });

  it('should handle isUnknownAuth flag correctly', () => {
    const fakeStore = makeFakeStore({
      User: {
        userInfo: null,
        authorizationStatus: AuthorizationStatus.Unknown,
      },
    });

    const { result } = renderLayoutStateHook(AppRoute.Root, fakeStore);

    expect(result.current.isUnknownAuth).toBe(true);
  });
});

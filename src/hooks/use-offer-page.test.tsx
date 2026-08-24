import { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';

import useOfferPage from './use-offer-page';
import { withStore } from '../utils/mock-component';
import {
  makeFakeStore,
  extractActionsTypes,
  makeFakeOffer,
  makeFakeOfferPreview,
} from '../utils/mocks';
import { setActiveOfferId } from '../store/slices/app/app.slice';
import { clearOfferPage } from '../store/slices/offer/offer.slice';
import { AppRoute } from '../const/infrastructure';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../store/api-actions', () => ({
  fetchOfferAction: vi.fn((id: string) => ({
    type: 'fetchOfferAction',
    payload: id,
  })),
  fetchNearOffersAction: vi.fn((id: string) => ({
    type: 'fetchNearOffersAction',
    payload: id,
  })),
  fetchReviewsAction: vi.fn((id: string) => ({
    type: 'fetchReviewsAction',
    payload: id,
  })),
}));

const renderOfferPageHook = (
  initialState = makeFakeStore(),
  routePath = '/offer/1',
) => {
  const { mockStore } = withStore(<div />, initialState);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={mockStore}>
      <MemoryRouter initialEntries={[routePath]}>
        <Routes>
          <Route path="/offer/:id" element={children} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  const hookResult = renderHook(() => useOfferPage(), { wrapper });

  return { ...hookResult, mockStore };
};

describe('Hook: useOfferPage', () => {
  it('should dispatch actions on mount and clear page on unmount', () => {
    const { mockStore, unmount } = renderOfferPageHook();

    expect(extractActionsTypes(mockStore.getActions())).toEqual([
      'fetchOfferAction',
      'fetchNearOffersAction',
      'fetchReviewsAction',
      setActiveOfferId.type,
    ]);

    unmount();

    expect(extractActionsTypes(mockStore.getActions())).toContain(
      clearOfferPage.type,
    );
  });

  it('should create mapOffers with current offer', () => {
    const offer = makeFakeOffer('1');
    const nearOffer = makeFakeOfferPreview('2');

    const initialState = makeFakeStore({
      Offer: {
        offer,
        nearOffers: [nearOffer],
        isOfferLoading: false,
        isOfferLoadingError: false,
        isNearOffersLoading: false,
        offerLoadingErrorCode: null,
      },
    });

    const { result } = renderOfferPageHook(initialState);

    expect(result.current.mapOffers).toEqual([nearOffer, offer]);
  });

  it('should navigate to NotFound route when offer loading fails', () => {
    const initialState = makeFakeStore({
      Offer: {
        offer: null,
        nearOffers: [],
        isOfferLoading: false,
        isOfferLoadingError: true,
        isNearOffersLoading: false,
        offerLoadingErrorCode: 404,
      },
    });

    renderOfferPageHook(initialState);

    expect(navigateMock).toHaveBeenCalledWith(AppRoute.NotFound, {
      replace: true,
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { createAPI } from '../services/api';
import {
  fetchOffersAction,
  fetchOfferAction,
  fetchNearOffersAction,
  fetchReviewsAction,
  postReviewAction,
  fetchFavoritesAction,
  changeFavoriteStatusAction,
  checkAuthAction,
  loginAction,
  logoutAction,
} from './api-actions';
import { APIRoute, FavoriteStatus } from '../const/infrastructure';
import { State } from '../types/state';
import * as utils from './utils';
import {
  AppThunkDispatch,
  extractActionsTypes,
  makeFakeOffer,
  makeFakeOfferPreview,
  makeFakeReview,
  makeFakeServerOffer,
} from '../utils/mocks';
import { Action } from 'redux';
import { MAX_NEAR_OFFERS_COUNT } from '../const/business';
import { clearFavorites } from './slices/favorites/favorites.slice';
import * as token from '../services/token';

describe('Async actions', () => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument({ api: axios })];
  const mockStoreCreator = configureMockStore<
    Partial<State>,
    Action<string>,
    AppThunkDispatch
  >(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    vi.restoreAllMocks();
    store = mockStoreCreator({});
    mockAxiosAdapter.reset();
  });

  describe('fetchOffersAction', () => {
    it('should dispatch "fetchOffersAction.pending" and "fetchOffersAction.fulfilled" when server response 200', async () => {
      const mockOffers = [makeFakeOfferPreview(), makeFakeOfferPreview()];
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

      await store.dispatch(fetchOffersAction());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOffersActionFulfilled = emittedActions.at(1) as ReturnType<
        typeof fetchOffersAction.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.fulfilled.type,
      ]);

      expect(fetchOffersActionFulfilled.payload).toEqual(mockOffers);
    });

    it('should dispatch "fetchOffersAction.pending" and "fetchOffersAction.rejected" with CustomServerError when server response 400', async () => {
      const mockErrorResponse = { message: 'Bad request' };
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(400, mockErrorResponse);

      await store.dispatch(fetchOffersAction());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOffersActionRejected = emittedActions.at(1) as ReturnType<
        typeof fetchOffersAction.rejected
      >;

      expect(extractedActionsTypes).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.rejected.type,
      ]);

      expect(fetchOffersActionRejected.payload).toEqual({
        status: 400,
        message: mockErrorResponse.message,
      });
    });
  });

  describe('fetchOfferAction', () => {
    it('should dispatch "fetchOfferAction.pending" and "fetchOfferAction.fulfilled" when server response 200', async () => {
      const mockServerOffer = makeFakeServerOffer();
      const mockAdaptedOffer = makeFakeOffer();
      const offerId = mockServerOffer.id;

      vi.spyOn(utils, 'adaptOffer').mockReturnValue(mockAdaptedOffer);
      mockAxiosAdapter
        .onGet(`${APIRoute.Offers}/${offerId}`)
        .reply(200, mockServerOffer);

      await store.dispatch(fetchOfferAction(offerId));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOfferActionFulfilled = emittedActions.at(1) as ReturnType<
        typeof fetchOfferAction.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchOfferAction.pending.type,
        fetchOfferAction.fulfilled.type,
      ]);

      expect(fetchOfferActionFulfilled.payload).toEqual(mockAdaptedOffer);
    });

    it('should dispatch "fetchOfferAction.pending" and "fetchOfferAction.rejected" with CustomServerError when server response 404', async () => {
      const offerId = 'non-existent-id';
      const mockErrorResponse = {
        errorType: 'COMMON_ERROR',
        message: `Offer with id ${offerId} not found.`,
        details: [],
      };

      mockAxiosAdapter
        .onGet(`${APIRoute.Offers}/${offerId}`)
        .reply(404, mockErrorResponse);

      await store.dispatch(fetchOfferAction(offerId));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOfferActionRejected = emittedActions.at(1) as ReturnType<
        typeof fetchOfferAction.rejected
      >;

      expect(extractedActionsTypes).toEqual([
        fetchOfferAction.pending.type,
        fetchOfferAction.rejected.type,
      ]);

      expect(fetchOfferActionRejected.payload).toEqual({
        status: 404,
        message: mockErrorResponse.message,
      });
    });
  });

  describe('fetchNearOffersAction', () => {
    it('should dispatch "fetchNearOffersAction.pending" and "fetchNearOffersAction.fulfilled" with sliced offers when server response 200', async () => {
      const mockNearOffers = Array.from(
        { length: MAX_NEAR_OFFERS_COUNT + 2 },
        () => makeFakeOfferPreview(),
      );
      const expectedOffers = mockNearOffers.slice(0, MAX_NEAR_OFFERS_COUNT);
      const offerId = 'test-offer-id';

      mockAxiosAdapter
        .onGet(`${APIRoute.Offers}/${offerId}${APIRoute.Nearby}`)
        .reply(200, mockNearOffers);

      await store.dispatch(fetchNearOffersAction(offerId));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchNearOffersActionFulfilled = emittedActions.at(1) as ReturnType<
        typeof fetchNearOffersAction.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchNearOffersAction.pending.type,
        fetchNearOffersAction.fulfilled.type,
      ]);

      expect(fetchNearOffersActionFulfilled.payload).toEqual(expectedOffers);
    });
  });

  describe('fetchReviews', () => {
    it('should dispatch "fetchReviews.pending" and "fetchReviews.fulfilled" when server response 200', async () => {
      const mockReviews = [makeFakeReview(), makeFakeReview()];
      const offerId = 'test-offer-id';

      mockAxiosAdapter
        .onGet(`${APIRoute.Comments}/${offerId}`)
        .reply(200, mockReviews);

      await store.dispatch(fetchReviewsAction(offerId));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchReviewsFulfilled = emittedActions.at(1) as ReturnType<
        typeof fetchReviewsAction.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchReviewsAction.pending.type,
        fetchReviewsAction.fulfilled.type,
      ]);

      expect(fetchReviewsFulfilled.payload).toEqual(mockReviews);
    });
  });

  describe('postReviewAction', () => {
    it('should dispatch "postReviewAction.pending" and "postReviewAction.fulfilled" when server response 200', async () => {
      const mockReview = makeFakeReview();
      const reviewData = {
        id: 'test-offer-id',
        comment: 'Great place!',
        rating: 5,
      };

      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${reviewData.id}`)
        .reply(200, mockReview);

      await store.dispatch(postReviewAction(reviewData));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const postReviewFulfilled = emittedActions.at(1) as ReturnType<
        typeof postReviewAction.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        postReviewAction.pending.type,
        postReviewAction.fulfilled.type,
      ]);

      expect(postReviewFulfilled.payload).toEqual(mockReview);
    });
  });

  describe('fetchFavoritesAction', () => {
    it('should dispatch "fetchFavoritesAction.pending" and "fetchFavoritesAction.fulfilled" when server response 200', async () => {
      const mockFavorites = [makeFakeOfferPreview()];
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, mockFavorites);

      await store.dispatch(fetchFavoritesAction());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchFavoritesActionFulfilled = emittedActions.at(1) as ReturnType<
        typeof fetchFavoritesAction.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchFavoritesAction.pending.type,
        fetchFavoritesAction.fulfilled.type,
      ]);

      expect(fetchFavoritesActionFulfilled.payload).toEqual(mockFavorites);
    });
  });

  describe('changeFavoriteStatusAction', () => {
    it('should dispatch "changeFavoriteStatusAction.pending" and "changeFavoriteStatusAction.fulfilled" when server response 200', async () => {
      const mockServerFavoriteResponse = makeFakeServerOffer();
      const mockOfferPreview = makeFakeOfferPreview();
      const payload = {
        offerId: mockOfferPreview.id,
        status: FavoriteStatus.Yes,
      };

      const mockAdaptedPreviewOffer = { ...mockOfferPreview, isFavorite: true };

      store = mockStoreCreator({
        Offers: {
          offers: [mockOfferPreview],
        },
      } as unknown as Partial<State>);

      vi.spyOn(utils, 'adaptFavoriteResponseToPreview').mockReturnValue(
        mockAdaptedPreviewOffer,
      );
      mockAxiosAdapter
        .onPost(`${APIRoute.Favorite}/${payload.offerId}/${payload.status}`)
        .reply(200, mockServerFavoriteResponse);

      await store.dispatch(changeFavoriteStatusAction(payload));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const changeFavoriteStatusActionFulfilled = emittedActions.at(
        1,
      ) as ReturnType<typeof changeFavoriteStatusAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        changeFavoriteStatusAction.pending.type,
        changeFavoriteStatusAction.fulfilled.type,
      ]);

      expect(changeFavoriteStatusActionFulfilled.payload).toEqual({
        ...mockOfferPreview,
        ...mockAdaptedPreviewOffer,
      });
    });
  });

  describe('checkAuthAction', () => {
    it('should dispatch "checkAuthAction.pending" and "checkAuthAction.fulfilled" when server response 200', async () => {
      const mockUser = {
        name: 'Thomas',
        email: 'thomas@test.com',
        token: 'test-token',
        avatarUrl: 'avatar.jpg',
        isPro: false,
      };

      mockAxiosAdapter.onGet(APIRoute.Login).reply(200, mockUser);

      await store.dispatch(checkAuthAction());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const checkAuthActionFulfilled = emittedActions.at(1) as ReturnType<
        typeof checkAuthAction.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.fulfilled.type,
      ]);

      expect(checkAuthActionFulfilled.payload).toEqual(mockUser);
    });
  });

  describe('loginAction', () => {
    it('should dispatch "loginAction.pending" and "loginAction.fulfilled" and save token when server response 200', async () => {
      const mockUser = {
        name: 'Thomas',
        email: 'thomas@test.com',
        token: 'test-token',
        avatarUrl: 'avatar.jpg',
        isPro: false,
      };

      const authData = {
        email: 'thomas@test.com',
        password: '123456',
      };

      const saveTokenSpy = vi.spyOn(token, 'saveToken');

      mockAxiosAdapter.onPost(APIRoute.Login, authData).reply(200, mockUser);

      await store.dispatch(loginAction(authData));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const loginActionFulfilled = emittedActions.at(1) as ReturnType<
        typeof loginAction.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        loginAction.pending.type,
        loginAction.fulfilled.type,
      ]);

      expect(loginActionFulfilled.payload).toEqual(mockUser);

      expect(saveTokenSpy).toHaveBeenCalledTimes(1);
      expect(saveTokenSpy).toHaveBeenCalledWith(mockUser.token);
    });
  });

  describe('logoutAction', () => {
    it('should dispatch "logoutAction.pending", "clearFavorites" and "logoutAction.fulfilled" and drop token when server response 200', async () => {
      const dropTokenSpy = vi.spyOn(token, 'dropToken');

      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

      await store.dispatch(logoutAction());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);

      expect(extractedActionsTypes).toEqual([
        logoutAction.pending.type,
        clearFavorites.type,
        logoutAction.fulfilled.type,
      ]);

      expect(dropTokenSpy).toHaveBeenCalledTimes(1);
    });
  });
});

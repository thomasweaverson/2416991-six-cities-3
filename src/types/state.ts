import { AxiosInstance } from 'axios';
import { store } from '../store';
import { AuthStatus } from './infrastructure';
import { UserData } from './user-data';
import { Offer, OfferPreview, Review } from './offer';
import { City, SortType } from './common';

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

type CustomServerError = {
  status: number;
  message: string;
};

export type AppThunkConfig = {
  dispatch: AppDispatch;
  state: State;
  extra: {
    api: AxiosInstance;
  };
  rejectValue: CustomServerError;
};

export type UserState = {
  authorizationStatus: AuthStatus;
  userInfo: null | UserData;
};

export type OfferState = {
  offer: null | Offer;
  isOfferLoading: boolean;
  isOfferLoadingError: boolean;
  offerLoadingErrorCode: number | null;
  nearOffers: OfferPreview[];
  isNearOffersLoading: boolean;
};

export type OffersState = {
  offers: OfferPreview[];
  isOffersLoading: boolean;
  isOffersLoadingError: boolean;
};

export type AppState = {
  currentCity: City;
  sortOption: SortType;
  activeOfferId: OfferPreview['id'] | null;
};

export type ReviewsState = {
  reviews: Review[];
  isPosting: boolean;
};

export type FavoritesState = {
  favoriteOffers: OfferPreview[];
  isFavoritesLoading: boolean;
};

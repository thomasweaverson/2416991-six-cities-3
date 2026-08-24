import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { State } from '../types/state';
import { AxiosInstance } from 'axios';
import { DEFAULT_CITY, DEFAULT_SORT_OPTION } from '../const/business';
import { AuthorizationStatus } from '../const/infrastructure';
import { Offer, OfferPreview, Review, ServerOffer } from '../types/offer';
import faker from 'faker';
import { City, CityName } from '../types/common';

export type AppThunkDispatch = ThunkDispatch<
  State,
  { api: AxiosInstance },
  Action
>;

export const extractActionsTypes = (actions: Action<string>[]) =>
  actions.map(({ type }) => type);

export const makeFakeStore = (initialState?: Partial<State>): State => ({
  App: {
    activeOfferId: null,
    currentCity: DEFAULT_CITY,
    sortOption: DEFAULT_SORT_OPTION,
  },
  Offers: { offers: [], isOffersLoading: false, isOffersLoadingError: false },
  Offer: {
    offer: null,
    isOfferLoading: false,
    isOfferLoadingError: false,
    offerLoadingErrorCode: null,
    nearOffers: [],
    isNearOffersLoading: false,
  },
  Reviews: { reviews: [], isPosting: false },
  Favorites: { favoriteOffers: [], isFavoritesLoading: false },
  User: { userInfo: null, authorizationStatus: AuthorizationStatus.Unknown },
  ...(initialState ?? {}),
});

export const makeFakeCity = (name = DEFAULT_CITY.name): City => ({
  name,
  location: { latitude: 50, longitude: 2, zoom: 10 },
});

export const makeFakeOfferPreview = (
  id?: string,
  cityName?: CityName,
  price?: number,
  rating?: number,
): OfferPreview => ({
  id: id || faker.datatype.uuid(),
  title: faker.lorem.words(3),
  type: 'apartment',
  price: price || 100,
  city: makeFakeCity(cityName),
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  isFavorite: true,
  isPremium: false,
  rating: rating || 4.5,
  previewImage: faker.image.imageUrl(),
});

export const makeFakeOffer = (id?: string): Offer => ({
  id: id || faker.datatype.uuid(),
  title: faker.lorem.words(3),
  type: 'apartment',
  price: 200,
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  isFavorite: false,
  isPremium: false,
  rating: 4.5,
  description: faker.lorem.paragraph(),
  images: [faker.image.imageUrl()],
  goods: ['Wi-Fi'],
  host: {
    name: faker.name.firstName(),
    avatarUrl: faker.image.avatar(),
    isPro: true,
  },
  bedroomsQuantity: 2,
  maxAdults: 3,
});

export const makeFakeServerOffer = (id?: string): ServerOffer => {
  const fakeOffer: Partial<Offer> = makeFakeOffer(id);
  const bedroomsCount = fakeOffer.bedroomsQuantity;
  delete fakeOffer.bedroomsQuantity;
  const serverOffer = { ...fakeOffer, bedrooms: bedroomsCount } as ServerOffer;
  return serverOffer;
};

export const makeFakeReview = (id?: string): Review => ({
  id: id || faker.datatype.uuid(),
  date: faker.date.recent().toISOString(),
  user: {
    name: faker.name.firstName(),
    avatarUrl: faker.image.avatar(),
    isPro: true,
  },
  comment: faker.lorem.paragraph(),
  rating: 5,
});

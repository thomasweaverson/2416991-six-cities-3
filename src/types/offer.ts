import { City, CityLocation } from './common';

export type User = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
};

type HousingType = 'apartment' | 'room' | 'house' | 'hotel';

type BaseOffer = {
  id: string;
  title: string;
  type: HousingType;
  price: number;
  city: City;
  location: CityLocation;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
};

export type OfferPreview = BaseOffer & {
  previewImage: string;
};

export type Offer = BaseOffer & {
  description: string;
  images: string[];
  goods: string[];
  host: User;
  bedroomsQuantity: number;
  maxAdults: number;
};

export type ServerOffer = Omit<Offer, 'bedroomsQuantity'> & {
  bedrooms: number;
};

export type Review = {
  id: string;
  user: User;
  rating: number;
  comment: string;
  date: string;
};

export type ReviewServer = {
  id: BaseOffer['id'];
  comment: string;
  rating: number;
};

export type ReviewFormData = Omit<ReviewServer, 'id'>

import { SortOption } from '../const/business';
import { FavoriteStatus } from '../const/infrastructure';
import { City, SortType } from '../types/common';
import { Offer, OfferPreview, ServerOffer } from '../types/offer';

const filterOffersByCity = (
  offers: OfferPreview[],
  city: City,
): OfferPreview[] => offers.filter((offer) => offer.city.name === city.name);

const sortOffers = (
  offers: OfferPreview[],
  sortBy: SortType,
): OfferPreview[] => {
  switch (sortBy) {
    case SortOption.PriceHighToLow:
      return [...offers].sort((a, b) => b.price - a.price);
    case SortOption.PriceLowToHigh:
      return [...offers].sort((a, b) => a.price - b.price);
    case SortOption.TopRatedFirst:
      return [...offers].sort((a, b) => b.rating - a.rating);
    default:
      return offers;
  }
};

export const prepareOffers = (
  offers: OfferPreview[],
  city: City,
  sortBy: SortType,
): OfferPreview[] => {
  const filteredOffers = filterOffersByCity(offers, city);
  return sortOffers(filteredOffers, sortBy);
};

export const adaptOffer = (serverOffer: ServerOffer): Offer => {
  const { bedrooms, ...rest } = serverOffer;
  return {
    ...rest,
    bedroomsQuantity: bedrooms,
  };
};

export const adaptFavoriteResponseToPreview = (
  data: ServerOffer,
  status: FavoriteStatus,
  fallbackPreviewImage?: string
): OfferPreview => {
  let previewImage = '';

  if (fallbackPreviewImage) {
    previewImage = fallbackPreviewImage;
  } else if ('images' in data && Array.isArray(data.images) && data.images.length > 0) {
    previewImage = data.images[0];
  }

  return {
    id: data.id,
    title: data.title,
    type: data.type,
    price: data.price,
    city: data.city,
    location: data.location,
    isFavorite: status === FavoriteStatus.Yes,
    isPremium: Boolean(data.isPremium),
    rating: data.rating,
    previewImage,
  };
};

import { describe, it, expect } from 'vitest';
import {
  prepareOffers,
  adaptOffer,
  adaptFavoriteResponseToPreview,
} from './utils';
import { DEFAULT_SORT_OPTION, SortOption } from '../const/business';
import { FavoriteStatus } from '../const/infrastructure';
import { ServerOffer } from '../types/offer';
import {
  makeFakeCity,
  makeFakeOfferPreview,
  makeFakeServerOffer,
} from '../utils/mocks';

describe('Store Utils', () => {
  describe('prepareOffers', () => {
    const parisCheap = makeFakeOfferPreview('p1', 'Paris', 100, 3.0);
    const parisExpensive = makeFakeOfferPreview('p2', 'Paris', 500, 5.0);
    const amsterdamOffer = makeFakeOfferPreview('a1', 'Amsterdam', 300, 4.5);

    const offers = [parisCheap, amsterdamOffer, parisExpensive];
    const paris = makeFakeCity('Paris');

    it('should filter offers by city and keep default order for POPULAR', () => {
      const result = prepareOffers(offers, paris, DEFAULT_SORT_OPTION);

      expect(result).toEqual([parisCheap, parisExpensive]);
    });

    it('should filter by city and sort offers by price: low to high', () => {
      const result = prepareOffers(offers, paris, SortOption.PriceLowToHigh);

      expect(result).toEqual([parisCheap, parisExpensive]);
    });

    it('should filter by city and sort offers by price: high to low', () => {
      const result = prepareOffers(offers, paris, SortOption.PriceHighToLow);

      expect(result).toEqual([parisExpensive, parisCheap]);
    });

    it('should filter by city and sort offers by top rated first', () => {
      const result = prepareOffers(offers, paris, SortOption.TopRatedFirst);

      expect(result).toEqual([parisExpensive, parisCheap]);
    });

    it('should return empty array if no offers match the city', () => {
      const cologne = makeFakeCity('Cologne');
      const result = prepareOffers(offers, cologne, DEFAULT_SORT_OPTION);

      expect(result).toEqual([]);
    });
  });

  describe('adaptOffer', () => {
    it('should map "bedrooms" property to "bedroomsQuantity"', () => {
      const serverOffer: ServerOffer = {
        id: 'server-offer-id',
        title: 'Nice Place',
        type: 'house',
        price: 250,
        city: makeFakeCity('Paris'),
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        isFavorite: false,
        isPremium: true,
        rating: 4.8,
        description: 'Cozy home',
        images: ['img1.jpg', 'img2.jpg'],
        goods: ['Wi-Fi'],
        host: { name: 'John', avatarUrl: 'avatar.jpg', isPro: true },
        bedrooms: 3,
        maxAdults: 4,
      };

      const result = adaptOffer(serverOffer);

      const expectedOffer: Partial<ServerOffer> = { ...serverOffer };
      delete expectedOffer.bedrooms;

      expect(result).toEqual({
        ...expectedOffer,
        bedroomsQuantity: 3,
      });
      expect(result).not.toHaveProperty('bedrooms');
    });
  });

  describe('Function: adaptFavoriteResponseToPreview', () => {
    it('should correctly map server offer data to offer preview', () => {
      const mockServerOffer = makeFakeServerOffer();
      const result = adaptFavoriteResponseToPreview(
        mockServerOffer,
        FavoriteStatus.No,
      );

      expect(result).toEqual({
        id: mockServerOffer.id,
        title: mockServerOffer.title,
        type: mockServerOffer.type,
        price: mockServerOffer.price,
        city: mockServerOffer.city,
        location: mockServerOffer.location,
        isFavorite: false,
        isPremium: Boolean(mockServerOffer.isPremium),
        rating: mockServerOffer.rating,
        previewImage: mockServerOffer.images[0],
      });
    });

    it('should set isFavorite to true when status is FavoriteStatus.Yes', () => {
      const mockServerOffer = makeFakeServerOffer();
      const result = adaptFavoriteResponseToPreview(
        mockServerOffer,
        FavoriteStatus.Yes,
      );

      expect(result.isFavorite).toBe(true);
    });

    it('should set isFavorite to false when status is FavoriteStatus.No', () => {
      const mockServerOffer = makeFakeServerOffer();
      const result = adaptFavoriteResponseToPreview(
        mockServerOffer,
        FavoriteStatus.No,
      );

      expect(result.isFavorite).toBe(false);
    });

    it('should use fallbackPreviewImage when it is provided', () => {
      const mockServerOffer = makeFakeServerOffer();
      const fallbackImage = 'https://example.com/fallback.jpg';

      const result = adaptFavoriteResponseToPreview(
        mockServerOffer,
        FavoriteStatus.Yes,
        fallbackImage,
      );

      expect(result.previewImage).toBe(fallbackImage);
    });

    it('should extract first image from data.images when fallbackPreviewImage is not provided', () => {
      const mockServerOffer = makeFakeServerOffer();
      mockServerOffer.images = [
        'https://example.com/first.jpg',
        'https://example.com/second.jpg',
      ];

      const result = adaptFavoriteResponseToPreview(
        mockServerOffer,
        FavoriteStatus.Yes,
      );

      expect(result.previewImage).toBe('https://example.com/first.jpg');
    });

    it('should set previewImage to empty string when no fallback is provided and images array is empty or missing', () => {
      const mockServerOffer = makeFakeServerOffer();
      mockServerOffer.images = [];

      const result = adaptFavoriteResponseToPreview(
        mockServerOffer,
        FavoriteStatus.Yes,
      );

      expect(result.previewImage).toBe('');
    });
  });
});

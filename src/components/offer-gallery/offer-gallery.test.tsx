import { render, screen } from '@testing-library/react';
import faker from 'faker';
import { describe, expect, it } from 'vitest';
import { MAX_IMAGES_COUNT_IN_OFFER_GALLERY } from '../../const/business';
import OfferGallery from './offer-gallery';

describe('Component: OfferGallery', () => {
  it('should render all images if count is less than or equal to max limit', () => {
    const mockType = 'house';
    const mockImages = Array.from({ length: 3 }, () => faker.image.imageUrl());

    render(<OfferGallery images={mockImages} type={mockType} />);

    const renderedImages = screen.getAllByRole('img');

    expect(renderedImages).toHaveLength(3);

    renderedImages.forEach((img, index) => {
      expect(img).toHaveAttribute('src', mockImages[index]);
      expect(img).toHaveAttribute('alt', `Photo ${mockType}`);
    });
  });

  it('should slice images array to MAX_IMAGES_COUNT_IN_OFFER_GALLERY when passed more images than allowed', () => {
    const mockType = 'apartment';

    const imagesExceedingLimit = MAX_IMAGES_COUNT_IN_OFFER_GALLERY + 4;
    const mockImages = Array.from({ length: imagesExceedingLimit }, () =>
      faker.image.imageUrl(),
    );

    render(<OfferGallery images={mockImages} type={mockType} />);

    const renderedImages = screen.getAllByRole('img');

    expect(renderedImages).toHaveLength(MAX_IMAGES_COUNT_IN_OFFER_GALLERY);
  });

  it('should render no images when images array is empty', () => {
    const mockType = 'hotel';

    render(<OfferGallery images={[]} type={mockType} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

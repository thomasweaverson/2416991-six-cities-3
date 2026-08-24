import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import OfferHeading from './offer-heading';
import { Block } from '../../const/common';
import { makeFakeOffer } from '../../utils/mocks';

vi.mock('../bookmark/bookmark', () => ({
  default: ({
    block,
    isSmall,
    isActive,
    offerId,
  }: {
    block: string;
    isSmall: boolean;
    isActive: boolean;
    offerId: string;
  }) => (
    <div data-testid="bookmark">
      {`${block}-${isSmall}-${isActive}-${offerId}`}
    </div>
  ),
}));

vi.mock('../mark/mark', () => ({
  default: ({ blockClassName }: { blockClassName: string }) => (
    <div data-testid="mark">{blockClassName}</div>
  ),
}));

describe('Component: OfferHeading', () => {
  it('should render offer title', () => {
    const offer = makeFakeOffer();

    render(
      <OfferHeading
        title={offer.title}
        isFavorite={offer.isFavorite}
        isPremium={offer.isPremium}
        id={offer.id}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1 }),
    ).toHaveTextContent(offer.title);
  });

  it('should render premium mark for premium offer', () => {
    const offer = makeFakeOffer();

    render(
      <OfferHeading
        title={offer.title}
        isFavorite={offer.isFavorite}
        isPremium
        id={offer.id}
      />,
    );

    expect(screen.getByTestId('mark')).toHaveTextContent(
      Block.Offer,
    );
  });

  it('should not render premium mark for regular offer', () => {
    const offer = makeFakeOffer();

    render(
      <OfferHeading
        title={offer.title}
        isFavorite={offer.isFavorite}
        isPremium={false}
        id={offer.id}
      />,
    );

    expect(
      screen.queryByTestId('mark'),
    ).not.toBeInTheDocument();
  });

  it('should pass correct props to bookmark', () => {
    const offer = makeFakeOffer();

    render(
      <OfferHeading
        title={offer.title}
        isFavorite
        isPremium={false}
        id={offer.id}
      />,
    );

    expect(screen.getByTestId('bookmark')).toHaveTextContent(
      `${Block.Offer}-false-true-${offer.id}`,
    );
  });
});

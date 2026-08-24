import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import OfferReviews from './offer-reviews';
import { withStore } from '../../utils/mock-component';
import { makeFakeReview, makeFakeStore } from '../../utils/mocks';
import { AuthorizationStatus } from '../../const/infrastructure';
import { MAX_REVIEWS_FOR_VIEW } from '../../const/business';

vi.mock('../review-form/review-form', () => ({
  default: () => <div>Review form</div>,
}));

vi.mock('../reviews-list/reviews-list', () => ({
  default: ({ reviews }: { reviews: unknown[] }) => (
    <div data-testid="reviews-list">{reviews.length} reviews</div>
  ),
}));

vi.mock('../spinner/spinner', () => ({
  default: () => <div>Spinner</div>,
}));

describe('Component: OfferReviews', () => {
  it('should render reviews and their amount', () => {
    const reviews = [makeFakeReview('review-1'), makeFakeReview('review-2')];

    const { withStoreComponent } = withStore(
      <OfferReviews reviews={reviews} />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render no reviews when reviews array is empty', () => {
    const { withStoreComponent } = withStore(
      <OfferReviews reviews={[]} />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.queryByText('Reviews ·')).not.toBeInTheDocument();
    expect(screen.queryByTestId('reviews-list')).not.toBeInTheDocument();
  });

  it('should show only maximum allowed number of reviews', () => {
    const reviews = Array.from(
      { length: MAX_REVIEWS_FOR_VIEW + 3 },
      (_, index) => makeFakeReview(`review-${index}`),
    );

    const { withStoreComponent } = withStore(
      <OfferReviews reviews={reviews} />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByTestId('reviews-list')).toHaveTextContent(
      `${MAX_REVIEWS_FOR_VIEW} reviews`,
    );
  });

  it('should show spinner when authorization status is unknown', () => {
    const { withStoreComponent } = withStore(
      <OfferReviews reviews={[]} />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.Unknown,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText('Spinner')).toBeInTheDocument();
  });

  it('should show review form when user is authorized', () => {
    const { withStoreComponent } = withStore(
      <OfferReviews reviews={[]} />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.Auth,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText('Review form')).toBeInTheDocument();
  });
});

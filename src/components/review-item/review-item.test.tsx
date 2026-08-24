import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ReviewItem from './review-item';
import { makeFakeReview } from '../../utils/mocks';

import styles from './review-item.module.css';

vi.mock('../rating/rating', () => ({
  default: ({ rating }: { rating: number }) => (
    <div data-testid="rating">{rating}</div>
  ),
}));

vi.mock('../review-date/review-date', () => ({
  default: ({ date }: { date: string }) => (
    <div data-testid="review-date">{date}</div>
  ),
}));

describe('Component: ReviewItem', () => {
  it('should render review information', () => {
    const review = makeFakeReview();

    render(<ReviewItem review={review} />);

    expect(screen.getByText(review.user.name)).toBeInTheDocument();
    expect(screen.getByText(review.comment)).toBeInTheDocument();

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      review.user.avatarUrl,
    );
  });

  it('should add pro class for professional user', () => {
    const review = makeFakeReview();
    review.user.isPro = true;

    render(<ReviewItem review={review} />);

    expect(screen.getByTestId('review-avatar-wrapper')).toHaveClass(styles.avatarWrapperPro);
  });

  it('should not add pro class for regular user', () => {
    const review = makeFakeReview();
    review.user.isPro = false;

    render(<ReviewItem review={review} />);

    expect(screen.getByTestId('review-avatar-wrapper')).not.toHaveClass('reviews__avatar-wrapper--pro');
  });

  it('should render rating and date', () => {
    const review = makeFakeReview();

    render(<ReviewItem review={review} />);

    expect(screen.getByTestId('rating')).toHaveTextContent(
      String(review.rating),
    );

    expect(screen.getByTestId('review-date')).toHaveTextContent(
      review.date,
    );
  });
});

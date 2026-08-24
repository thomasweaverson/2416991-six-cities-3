import { render, screen } from '@testing-library/react';
import faker from 'faker';
import { describe, expect, it } from 'vitest';
import { Block } from '../../const/common';
import Rating from './rating';

describe('Component: Rating', () => {
  it('should render correctly with default block prop and apply width style', () => {
    const mockRating = 4;

    const { container } = render(<Rating rating={mockRating} />);

    expect(screen.getByText('Rating')).toBeInTheDocument();

    const starSpan = container.querySelector('.rating__stars > span:not(.visually-hidden)');
    expect(starSpan).toHaveStyle({ width: '80%' });
    expect(screen.queryByText(mockRating)).not.toBeInTheDocument();
  });

  it('should render numeric rating value when block prop is Block.OFFER', () => {
    const mockRating = faker.datatype.number({ min: 1, max: 5 });

    render(<Rating block={Block.Offer} rating={mockRating} />);

    expect(screen.getByText(mockRating.toString())).toBeInTheDocument();
  });
});

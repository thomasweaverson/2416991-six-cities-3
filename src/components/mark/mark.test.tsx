import { describe, expect } from 'vitest';
import { Block } from '../../const/common';
import { render, screen } from '@testing-library/react';
import Mark from './mark';

describe('Component: Mark', () => {
  it('should render correctly with default props', () => {
    render(<Mark />);

    const titleElement = screen.getByText('Premium');
    const wrapperElement = titleElement.parentElement;

    expect(titleElement).toBeInTheDocument();
    expect(wrapperElement).toHaveClass(`${Block.PlaceCard}__mark`);
  });

  it('should render correctly with custom props', () => {
    const expectedTitle = 'SomeBoringTestTitle';
    const customBlock = Block.Offer;

    render(<Mark blockClassName={customBlock} title={expectedTitle} />);

    const titleElement = screen.getByText(expectedTitle);
    const wrapperElement = titleElement.parentElement;

    expect(titleElement).toBeInTheDocument();
    expect(wrapperElement).toHaveClass(`${customBlock}__mark`);
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { withStore } from '../../utils/mock-component';
import { makeFakeOfferPreview, makeFakeStore, extractActionsTypes } from '../../utils/mocks';
import { Block } from '../../const/common';
import { setActiveOfferId } from '../../store/slices/app/app.slice';
import { ImageSize } from './const';
import { OfferCard } from './offer-card';

vi.mock('../bookmark/bookmark', () => ({
  default: () => <button>Bookmark</button>,
}));

vi.mock('../mark/mark', () => ({
  default: () => <div>Premium mark</div>,
}));

vi.mock('../rating/rating', () => ({
  default: () => <div>Rating</div>,
}));

describe('Component: OfferCard', () => {
  it('should render offer information', () => {
    const offer = makeFakeOfferPreview(
      'offer-1',
      undefined,
      200,
      4.5,
    );

    offer.title = 'Nice apartment';
    offer.type = 'apartment';

    const { withStoreComponent } = withStore(
      <OfferCard offer={offer} />,
      makeFakeStore(),
    );

    render(
      <MemoryRouter>
        {withStoreComponent}
      </MemoryRouter>,
    );

    expect(screen.getByText('€200')).toBeInTheDocument();
    expect(screen.getByText('Nice apartment')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('should render premium mark for premium offer', () => {
    const offer = makeFakeOfferPreview();
    offer.isPremium = true;

    const { withStoreComponent } = withStore(
      <OfferCard offer={offer} />,
      makeFakeStore(),
    );

    render(
      <MemoryRouter>
        {withStoreComponent}
      </MemoryRouter>,
    );

    expect(screen.getByText('Premium mark')).toBeInTheDocument();
  });

  it('should not render premium mark for regular offer', () => {
    const offer = makeFakeOfferPreview();
    offer.isPremium = false;

    const { withStoreComponent } = withStore(
      <OfferCard offer={offer} />,
      makeFakeStore(),
    );

    render(
      <MemoryRouter>
        {withStoreComponent}
      </MemoryRouter>,
    );

    expect(screen.queryByText('Premium mark')).not.toBeInTheDocument();
  });

  it('should have correct offer link', () => {
    const offer = makeFakeOfferPreview('offer-123');

    const { withStoreComponent } = withStore(
      <OfferCard offer={offer} />,
      makeFakeStore(),
    );

    render(
      <MemoryRouter>
        {withStoreComponent}
      </MemoryRouter>,
    );

    const links = screen.getAllByRole('link');

    links.forEach((link) => {
      expect(link).toHaveAttribute(
        'href',
        `${'/offer'}/${offer.id}`,
      );
    });
  });

  it('should set active offer id on mouse enter in cities block', async () => {
    const offer = makeFakeOfferPreview('offer-123');

    const { withStoreComponent, mockStore } = withStore(
      <OfferCard
        offer={offer}
        block={Block.Cities}
      />,
      makeFakeStore(),
    );

    render(
      <MemoryRouter>
        {withStoreComponent}
      </MemoryRouter>,
    );

    const card = screen.getByRole('article');

    await userEvent.hover(card);

    expect(
      extractActionsTypes(mockStore.getActions()),
    ).toContain(setActiveOfferId.type);

    expect(mockStore.getActions()).toContainEqual(
      setActiveOfferId(offer.id),
    );
  });

  it('should reset active offer id on mouse leave in cities block', async () => {
    const offer = makeFakeOfferPreview('offer-123');

    const { withStoreComponent, mockStore } = withStore(
      <OfferCard
        offer={offer}
        block={Block.Cities}
      />,
      makeFakeStore(),
    );

    render(
      <MemoryRouter>
        {withStoreComponent}
      </MemoryRouter>,
    );

    const card = screen.getByRole('article');

    await userEvent.hover(card);
    await userEvent.unhover(card);

    expect(mockStore.getActions()).toContainEqual(
      setActiveOfferId(null),
    );
  });

  it('should not change active offer for favorites block', async () => {
    const offer = makeFakeOfferPreview('offer-123');

    const { withStoreComponent, mockStore } = withStore(
      <OfferCard
        offer={offer}
        block={Block.Favorites}
      />,
      makeFakeStore(),
    );

    render(
      <MemoryRouter>
        {withStoreComponent}
      </MemoryRouter>,
    );

    const card = screen.getByRole('article');

    await userEvent.hover(card);
    await userEvent.unhover(card);

    expect(
      mockStore.getActions(),
    ).not.toContainEqual(setActiveOfferId(offer.id));

    expect(
      mockStore.getActions(),
    ).not.toContainEqual(setActiveOfferId(null));
  });

  it('should use regular image size by default', () => {
    const offer = makeFakeOfferPreview();

    const { withStoreComponent } = withStore(
      <OfferCard offer={offer} />,
      makeFakeStore(),
    );

    render(
      <MemoryRouter>
        {withStoreComponent}
      </MemoryRouter>,
    );

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute(
      'width',
      String(ImageSize.Regular.width),
    );
    expect(image).toHaveAttribute(
      'height',
      String(ImageSize.Regular.height),
    );
  });

  it('should use small image size for favorites block', () => {
    const offer = makeFakeOfferPreview();

    const { withStoreComponent } = withStore(
      <OfferCard
        offer={offer}
        block={Block.Favorites}
      />,
      makeFakeStore(),
    );

    render(
      <MemoryRouter>
        {withStoreComponent}
      </MemoryRouter>,
    );

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute(
      'width',
      String(ImageSize.Small.width),
    );
    expect(image).toHaveAttribute(
      'height',
      String(ImageSize.Small.height),
    );
  });
});

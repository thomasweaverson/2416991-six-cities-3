import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import Bookmark from './bookmark';
import { withHistory, withStore } from '../../utils/mock-component';
import {
  APIRoute,
  AppRoute,
  AuthorizationStatus,
  FavoriteStatus,
} from '../../const/infrastructure';
import { Block } from '../../const/common';
import { changeFavoriteStatusAction } from '../../store/api-actions';
import {
  extractActionsTypes,
  makeFakeOfferPreview,
  makeFakeStore,
} from '../../utils/mocks';
import { Route, Routes } from 'react-router-dom';

const fakeOffer = makeFakeOfferPreview('offer-1');

describe('Component: Bookmark', () => {
  it('should render active bookmark', () => {
    const { withStoreComponent } = withStore(
      <Bookmark isActive offerId={fakeOffer.id} />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.Auth,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    const button = screen.getByRole('button', {
      name: 'To bookmarks',
    });

    expect(button).toHaveClass(`${Block.PlaceCard}__bookmark-button--active`);
  });

  it('should render big bookmark when isSmall is false', () => {
    const { withStoreComponent } = withStore(
      <Bookmark isActive={false} isSmall={false} offerId={fakeOffer.id} />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.Auth,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    const icon = screen.getByTestId('bookmark-icon');

    expect(icon).toHaveAttribute('width', '31');
    expect(icon).toHaveAttribute('height', '33');
  });

  it('should redirect unauthorized user to login', async () => {
    const { withStoreComponent } = withStore(
      <Bookmark isActive={false} offerId={fakeOffer.id} />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      }),
    );

    render(
      withHistory(
        <Routes>
          <Route path="/offer/:id" element={withStoreComponent} />
          <Route path={AppRoute.Login} element={<div>Login page</div>} />
        </Routes>,
        ['/offer/offer-1'],
      ),
    );

    await userEvent.click(screen.getByRole('button', { name: 'To bookmarks' }));

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('should send request to add offer to favorites', async () => {
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      <Bookmark isActive={false} offerId={fakeOffer.id} />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.Auth,
        },
      }),
    );

    mockAxiosAdapter
      .onPost(`${APIRoute.Favorite}/${fakeOffer.id}/${FavoriteStatus.Yes}`)
      .reply(200, fakeOffer);

    render(withHistory(withStoreComponent));

    await userEvent.click(screen.getByRole('button', { name: 'To bookmarks' }));

    expect(extractActionsTypes(mockStore.getActions())).toContain(
      changeFavoriteStatusAction.pending.type,
    );
  });

  it('should send request to remove offer from favorites', async () => {
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      <Bookmark isActive offerId={fakeOffer.id} />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.Auth,
        },
      }),
    );

    mockAxiosAdapter
      .onPost(`${APIRoute.Favorite}/${fakeOffer.id}/${FavoriteStatus.No}`)
      .reply(200, fakeOffer);

    render(withHistory(withStoreComponent));

    await userEvent.click(screen.getByRole('button', { name: 'To bookmarks' }));

    expect(extractActionsTypes(mockStore.getActions())).toContain(
      changeFavoriteStatusAction.pending.type,
    );
  });
});

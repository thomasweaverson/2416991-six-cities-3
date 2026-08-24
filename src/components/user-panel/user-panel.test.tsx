import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import UserPanel from './user-panel';
import { withStore } from '../../utils/mock-component';
import { extractActionsTypes, makeFakeStore } from '../../utils/mocks';
import { AuthorizationStatus } from '../../const/infrastructure';
import { logoutAction } from '../../store/api-actions';

vi.mock('../user-link/user-link', () => ({
  default: () => <div>User link</div>,
}));

describe('Component: UserPanel', () => {
  it('should render sign in for unauthorized user', () => {
    const { withStoreComponent } = withStore(
      <UserPanel />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
    expect(screen.queryByText('User link')).not.toBeInTheDocument();
  });

  it('should have login link for unauthorized user', () => {
    const { withStoreComponent } = withStore(
      <UserPanel />,
      makeFakeStore({
        User: {
          userInfo: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      }),
    );

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        {withStoreComponent}
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', {
      name: 'Sign in',
    });

    expect(link).toHaveAttribute('href', '/login');
  });

  it('should render user link and sign out for authorized user', () => {
    const { withStoreComponent } = withStore(
      <UserPanel />,
      makeFakeStore({
        User: {
          userInfo: {
            name: 'Thomas',
            email: 'thomas@example.com',
            token: 'token',
            avatarUrl: 'avatar.jpg',
            isPro: false,
          },
          authorizationStatus: AuthorizationStatus.Auth,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('User link')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
  });

  it('should dispatch logout action when sign out is clicked', async () => {
    const { withStoreComponent, mockStore } = withStore(
      <UserPanel />,
      makeFakeStore({
        User: {
          userInfo: {
            name: 'Thomas',
            email: 'thomas@example.com',
            token: 'token',
            avatarUrl: 'avatar.jpg',
            isPro: false,
          },
          authorizationStatus: AuthorizationStatus.Auth,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    await userEvent.click(screen.getByText('Sign out'));

    expect(extractActionsTypes(mockStore.getActions())).toContain(
      logoutAction.pending.type,
    );
  });
});

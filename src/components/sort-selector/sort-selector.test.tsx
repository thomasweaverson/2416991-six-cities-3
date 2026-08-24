import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import SortSelector from './sort-selector';
import { withStore } from '../../utils/mock-component';
import { makeFakeStore } from '../../utils/mocks';
import { setSort } from '../../store/slices/app/app.slice';
import { SortOption } from '../../const/business';
import { SortType } from '../../types/common';

vi.mock('../sort-item/sort-item', () => ({
  default: ({
    title,
    isActive,
    onItemClick,
  }: {
    title: string;
    isActive: boolean;
    onItemClick: (title: string) => void;
  }) => (
    <li
      data-testid="sort-item"
      className={isActive ? 'active' : ''}
      onClick={() => onItemClick(title)}
    >
      {title}
    </li>
  ),
}));

describe('Component: SortSelector', () => {
  it('should render current sort type', () => {
    const { withStoreComponent } = withStore(<SortSelector />, makeFakeStore());

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(
      screen.getByText(SortOption.Popular, {
        selector: '.places__sorting-type',
      }),
    ).toBeInTheDocument();
  });

  it('should open sort options when clicked', async () => {
    const { withStoreComponent } = withStore(<SortSelector />, makeFakeStore());

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    const sortingType = screen.getByText(SortOption.Popular, {
      selector: '.places__sorting-type',
    });

    const options = screen.getByRole('list');

    expect(options).not.toHaveClass('places__options--opened');

    await userEvent.click(sortingType);

    expect(options).toHaveClass('places__options--opened');
  });

  it('should mark current sort option as active', () => {
    const { withStoreComponent } = withStore(<SortSelector />, makeFakeStore());

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    const activeOption = screen
      .getAllByTestId('sort-item')
      .find((item) => item.textContent === SortOption.Popular);

    expect(activeOption).toHaveClass('active');
  });

  it('should dispatch setSort when sort option is selected', async () => {
    const { withStoreComponent, mockStore } = withStore(
      <SortSelector />,
      makeFakeStore(),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    const options = screen.getAllByTestId('sort-item');

    const optionToSelect = options.find(
      (item) => item.textContent !== SortOption.Popular,
    );

    if (!optionToSelect) {
      throw new Error('No alternative sort option found');
    }

    await userEvent.click(optionToSelect);

    expect(mockStore.getActions()).toContainEqual(
      setSort(optionToSelect.textContent as SortType),
    );
  });
});

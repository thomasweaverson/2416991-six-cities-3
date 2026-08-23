import { memo, useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { SortType } from '../../types/common';
import { SortOption } from '../../const/business';
import SortItem from '../sort-item/sort-item';
import { setSort } from '../../store/slices/app/app.slice';
import { getSort } from '../../store/slices/app/app.selectors';

const SortSelector = memo((): JSX.Element => {
  const currentSortType = useAppSelector(getSort);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    setIsOptionsOpen(false);
  }, [currentSortType]);

  const dispatch = useAppDispatch();

  const setSortOption = useCallback(
    (sortType: SortType) => {
      dispatch(setSort(sortType));
    },
    [dispatch],
  );

  const handleSortItemClick = () => setIsOptionsOpen(!isOptionsOpen);

  const sortTypes = Object.values(SortOption);
  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>{' '}
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={handleSortItemClick}
      >
        {currentSortType}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${isOptionsOpen ? 'places__options--opened' : ''}`}
      >
        {sortTypes.map((sortItem) => (
          <SortItem
            key={sortItem}
            title={sortItem}
            isActive={sortItem === currentSortType}
            onItemClick={setSortOption}
          />
        ))}
      </ul>
    </form>
  );
});

SortSelector.displayName = 'SortSelector';

export default SortSelector;

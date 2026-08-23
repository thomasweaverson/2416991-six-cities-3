import { memo } from 'react';
import { SortType } from '../../types/common';

type SortOptionProps = {
  title: SortType;
  isActive: boolean;
  onItemClick: (sortType: SortType) => void;
};

const SortItem = memo(
  ({ title, isActive, onItemClick }: SortOptionProps): JSX.Element => {
    const handleItemClick = () => onItemClick(title);
    return (
      <li
        className={`places__option ${isActive ? 'places__option--active' : ''}`}
        tabIndex={0}
        onClick={handleItemClick}
      >
        {title}
      </li>
    );
  },
);

SortItem.displayName = 'SortItem';

export default SortItem;

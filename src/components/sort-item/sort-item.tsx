import { memo } from 'react';
import { SortType } from '../../types/common';
import classNames from 'classnames';

type SortOptionProps = {
  title: SortType;
  isActive: boolean;
  onItemClick: (sortType: SortType) => void;
};

const SortItem = memo(
  ({ title, isActive, onItemClick }: SortOptionProps): JSX.Element => {
    const handleItemClick = () => onItemClick(title);
    const itemClass = classNames('places__option', {
      'places__option--active': isActive,
    });
    return (
      <li
        className={itemClass}
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

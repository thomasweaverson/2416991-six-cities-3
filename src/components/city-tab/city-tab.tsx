import { memo, MouseEvent } from 'react';
import { City } from '../../types/common';
import classNames from 'classnames';

type CityTabProps = {
  city: City;
  isActive: boolean;
  onTabClick: (city: City) => void;
};

const CityTab = memo(
  ({ city, isActive, onTabClick }: CityTabProps): JSX.Element => {
    const handleTabClick = (evt: MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      if (!isActive) {
        onTabClick(city);
      }
    };

    const tabClass = classNames('locations__item-link', 'tabs__item', {
      'tabs__item--active': isActive,
    });

    return (
      <li className="locations__item">
        <a className={tabClass} onClick={handleTabClick} href="#">
          <span>{city.name}</span>
        </a>
      </li>
    );
  },
);

CityTab.displayName = 'CityTab';

export default CityTab;

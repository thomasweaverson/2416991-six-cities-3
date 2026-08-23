import { memo, MouseEvent } from 'react';
import { City } from '../../types/common';

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

    return (
      <li className="locations__item">
        <a
          className={`locations__item-link tabs__item ${isActive ? 'tabs__item--active' : ''}`}
          onClick={handleTabClick}
          href="#"
        >
          <span>{city.name}</span>
        </a>
      </li>
    );
  },
);

CityTab.displayName = 'CityTab';

export default CityTab;

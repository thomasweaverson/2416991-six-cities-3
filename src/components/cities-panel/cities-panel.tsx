import { memo } from 'react';
import { Cities } from '../../const/business';
import { City, CityName } from '../../types/common';
import CityTab from '../city-tab/city-tab';

type CitiesPanelProps = {
  activeCity: CityName;
  onCityClick: (city: City) => void;
};

const CitiesPanel = memo(
  ({ activeCity, onCityClick }: CitiesPanelProps): JSX.Element => (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {Cities.map((city) => (
            <CityTab
              key={city.name}
              city={city}
              isActive={city.name === activeCity}
              onTabClick={onCityClick}
            />
          ))}
        </ul>
      </section>
    </div>
  ),
);

CitiesPanel.displayName = 'CitiesPanel';

export default CitiesPanel;

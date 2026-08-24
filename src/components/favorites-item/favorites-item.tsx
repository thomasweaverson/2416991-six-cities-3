import { memo } from 'react';
import { Block } from '../../const/common';
import { CityName } from '../../types/common';
import { OfferPreview } from '../../types/offer';
import { OfferCard } from '../offer-card/offer-card';
import { areFavoritesItemPropsEqual } from './utils';

export type FavoritesItemProps = {
  city: CityName;
  offers: OfferPreview[];
};

const FavoritesItem = ({
  city,
  offers,
}: FavoritesItemProps): JSX.Element | null => (
  <li className="favorites__locations-items">
    <div className="favorites__locations locations locations--current">
      <div className="locations__item">
        <a className="locations__item-link" href="#">
          <span>{city}</span>
        </a>
      </div>
    </div>
    <div className="favorites__places">
      {offers.map((offer) => (
        <OfferCard key={offer.id} block={Block.Favorites} offer={offer} />
      ))}
    </div>
  </li>
);

const MemoizedFavoritesItem = memo(FavoritesItem, areFavoritesItemPropsEqual);

export default MemoizedFavoritesItem;

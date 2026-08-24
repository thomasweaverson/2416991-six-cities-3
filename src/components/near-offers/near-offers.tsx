import { memo } from 'react';
import { Block } from '../../const/common';
import { OfferPreview } from '../../types/offer';
import { OfferCard } from '../offer-card/offer-card';

type NearOffersProps = {
  offers: OfferPreview[];
};

const NearOffers = memo(({ offers }: NearOffersProps): JSX.Element | null => {
  if (offers.length === 0) {
    return null;
  }
  return (
    <section className="near-places places">
      <h2 className="near-places__title">Other places in the neighbourhood</h2>
      <div className="near-places__list places__list">
        {offers.slice(0, 3).map((offer) => (
          <OfferCard key={offer.id} block={Block.NearPlaces} offer={offer} />
        ))}
      </div>
    </section>
  );
});

NearOffers.displayName = 'NearOffers';

export default NearOffers;

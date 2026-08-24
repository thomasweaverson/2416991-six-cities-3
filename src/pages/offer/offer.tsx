import NearOffers from '../../components/near-offers/near-offers';
import OfferFeatures from '../../components/offer-features/offer-features';
import OfferGallery from '../../components/offer-gallery/offer-gallery';
import OfferGoods from '../../components/offer-goods/offer-goods';
import OfferHeading from '../../components/offer-heading/offer-heading';
import OfferHost from '../../components/offer-host/offer-host';
import OfferPrice from '../../components/offer-price/offer-price';
import Rating from '../../components/rating/rating';
import { Block } from '../../const/common';
import { type Offer } from '../../types/offer';
import Map from '../../components/map/map';
import { ScrollToTop } from '../../components/scroll-to-top/scroll-to-top';
import Spinner from '../../components/spinner/spinner';
import OfferReviews from '../../components/offer-reviews/offer-reviews';
import { Helmet } from 'react-helmet-async';
import useOfferPage from '../../hooks/use-offer-page';

const Offer = (): JSX.Element | null => {
  const {
    offer,
    reviews,
    nearOffers,
    mapOffers,
    isOfferLoading,
    isNearOffersLoading,
  } = useOfferPage();

  if (isOfferLoading) {
    return <Spinner />;
  }

  if (!offer) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>6 Cities | {offer.title}</title>
      </Helmet>
      <ScrollToTop />
      <section className="offer">
        <OfferGallery images={offer.images} type={offer.type} />
        <div className="offer__container container">
          <div className="offer__wrapper">
            <OfferHeading
              title={offer.title}
              isFavorite={offer.isFavorite}
              isPremium={offer.isPremium}
              id={offer.id}
            />

            <Rating block={Block.Offer} rating={offer.rating} />

            <OfferFeatures
              type={offer.type}
              bedroomsQuantity={offer.bedroomsQuantity}
              maxAdults={offer.maxAdults}
            />

            <OfferPrice price={offer.price} />

            <OfferGoods goods={offer.goods} />

            <OfferHost
              name={offer.host.name}
              avatarUrl={offer.host.avatarUrl}
              isPro={offer.host.isPro}
              description={offer.description}
            />

            <OfferReviews reviews={reviews} />
          </div>
        </div>
        {isNearOffersLoading && <Spinner />}
        {!isNearOffersLoading && (
          <Map city={offer.city} offers={mapOffers} block={Block.Offer} />
        )}
      </section>
      {!isNearOffersLoading && (
        <div className="container">
          <NearOffers offers={nearOffers} />
        </div>
      )}
    </>
  );
};

export default Offer;

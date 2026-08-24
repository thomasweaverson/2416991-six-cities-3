import { Link } from 'react-router-dom';
import { Block } from '../../const/common';
import { AppRoute } from '../../const/infrastructure';
import { BlockName } from '../../types/common';
import { OfferPreview } from '../../types/offer';
import Bookmark from '../bookmark/bookmark';
import Mark from '../mark/mark';
import Rating from '../rating/rating';
import { capitalize } from '../../utils/common';
import { ImageSize } from './const';
import { useAppDispatch } from '../../hooks';
import { setActiveOfferId } from '../../store/slices/app/app.slice';
import { memo } from 'react';

type OfferCardProps = {
  block?: BlockName;
  offer: OfferPreview;
};

export const OfferCard = memo(
  ({ block = Block.Cities, offer }: OfferCardProps): JSX.Element => {
    const dispatch = useAppDispatch();
    const setActiveCardId = (id: string | null) => {
      dispatch(setActiveOfferId(id));
    };
    const imageSize =
      block === Block.Favorites ? ImageSize.Small : ImageSize.Regular;

    const handleMouseEnter = () => {
      if (block === Block.Cities) {
        setActiveCardId(offer.id);
      }
    };

    const handleMouseLeave = () => {
      if (block === Block.Cities) {
        setActiveCardId(null);
      }
    };

    return (
      <article
        className={`${block}__card place-card`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {offer.isPremium && <Mark />}
        <div className={`${block}__image-wrapper place-card__image-wrapper`}>
          <Link to={`${AppRoute.Offer}/${offer.id}`}>
            <img
              className="place-card__image"
              src={offer.previewImage}
              width={imageSize.width}
              height={imageSize.height}
              alt="Place image"
            />
          </Link>
        </div>
        <div className={`${block}__info place-card__info`}>
          <div className="place-card__price-wrapper">
            <div className="place-card__price">
              <b className="place-card__price-value">€{offer.price}</b>{' '}
              <span className="place-card__price-text">/&nbsp;night</span>
            </div>
            <Bookmark isActive={offer.isFavorite} offerId={offer.id} />
          </div>
          <Rating rating={offer.rating} />
          <h2 className="place-card__name">
            <Link to={`${AppRoute.Offer}/${offer.id}`}>{offer.title}</Link>
          </h2>
          <p className="place-card__type">{capitalize(offer.type)}</p>
        </div>
      </article>
    );
  },
);

OfferCard.displayName = 'OfferCard';

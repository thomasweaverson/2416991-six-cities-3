import { Block } from '../../const/common';
import { BlockName } from '../../types/common';
import { Offer } from '../../types/offer';
import { getStarsWidth } from './utils';

type RatingProps = { block?: BlockName } & Pick<Offer, 'rating'>;

const Rating = ({
  block = Block.PlaceCard,
  rating,
}: RatingProps): JSX.Element => {
  const width = getStarsWidth(rating);
  return (
    <div className={`${block}__rating rating`}>
      <div className={`${block}__stars rating__stars`}>
        <span style={{ width }}></span>
        <span className="visually-hidden">Rating</span>
      </div>
      {block === Block.Offer && (
        <span className={`${block}__rating-value rating__value`}>{rating}</span>
      )}
    </div>
  );
};

export default Rating;

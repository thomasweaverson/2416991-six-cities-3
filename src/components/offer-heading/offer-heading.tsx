import { Block } from '../../const/common';
import { Offer } from '../../types/offer';
import Bookmark from '../bookmark/bookmark';
import Mark from '../mark/mark';

type OfferHeadingProps = Pick<
  Offer,
  'title' | 'isFavorite' | 'isPremium' | 'id'
>;

const OfferHeading = ({
  title,
  isFavorite,
  isPremium,
  id,
}: OfferHeadingProps): JSX.Element => (
  <>
    {isPremium && <Mark blockClassName={Block.Offer} />}
    <div className="offer__name-wrapper">
      <h1 className="offer__name">{title}</h1>
      <Bookmark
        block={Block.Offer}
        isSmall={false}
        isActive={isFavorite}
        offerId={id}
      />
    </div>
  </>
);

export default OfferHeading;

import classNames from 'classnames';
import { Block } from '../../const/common';
import { Review } from '../../types/offer';
import Rating from '../rating/rating';
import ReviewDate from '../review-date/review-date';
import styles from './review-item.module.css';

type ReviewProps = {
  review: Review;
};

const ReviewItem = ({ review }: ReviewProps): JSX.Element => (
  <li className="reviews__item">
    <div className="reviews__user user">
      <div
        data-testid="review-avatar-wrapper"
        className={classNames(
          'reviews__avatar-wrapper',
          'user__avatar-wrapper',
          { [styles.avatarWrapperPro]: review.user.isPro },
        )}
      >
        <img
          className="reviews__avatar user__avatar"
          src={review.user.avatarUrl}
          width="54"
          height="54"
          alt="Reviews avatar"
        />
      </div>
      <span className="reviews__user-name">{review.user.name}</span>
    </div>
    <div className="reviews__info">
      <Rating block={Block.REVIEWS} rating={review.rating} />

      <p className="reviews__text">{review.comment}</p>
      <ReviewDate date={review.date} />
    </div>
  </li>
);

export default ReviewItem;

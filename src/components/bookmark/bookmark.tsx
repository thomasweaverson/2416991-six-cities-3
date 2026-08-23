import { MouseEvent, useState } from 'react';
import { Block } from '../../const/common';
import {
  AppRoute,
  AuthorizationStatus,
  FavoriteStatus,
} from '../../const/infrastructure';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeFavoriteStatusAction } from '../../store/api-actions';
import { BlockName } from '../../types/common';
import { OfferPreview } from '../../types/offer';
import { Size } from './const';
import { getAuthorizationStatus } from '../../store/slices/user/user.selectors';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';

type BookmarkProps = {
  isActive: boolean;
  block?: BlockName;
  isSmall?: boolean;
  offerId: OfferPreview['id'];
};

const Bookmark = ({
  isActive,
  block = Block.PLACE_CARD,
  isSmall = true,
  offerId,
}: BookmarkProps): JSX.Element => {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const size = isSmall ? Size.SMALL : Size.BIG;

  const handleBookmarkClick = (evt: MouseEvent) => {
    evt.preventDefault();

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login, { state: { from: location } });
      return;
    }

    const statusForFetching = isActive ? FavoriteStatus.No : FavoriteStatus.Yes;

    setIsFetching(true);

    dispatch(changeFavoriteStatusAction({ offerId, status: statusForFetching }))
      .unwrap()
      .catch(() => {
        toast.warn('Failed to update favorites. Please try again');
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const buttonClass = classNames(`${block}__bookmark-button`, 'button', {
    [`${block}__bookmark-button--active`]: isActive,
  });

  return (
    <button
      className={buttonClass}
      type="button"
      onClick={handleBookmarkClick}
      disabled={isFetching}
    >
      <svg
        data-testid="bookmark-icon"
        className={`${block}__bookmark-icon`}
        width={size.width}
        height={size.height}
      >
        <use xlinkHref="#icon-bookmark"></use>
      </svg>
      <span className="visually-hidden">To bookmarks</span>
    </button>
  );
};

export default Bookmark;

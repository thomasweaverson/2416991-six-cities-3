import { Link } from 'react-router-dom';
import { AppRoute } from '../../const/infrastructure';
import { useAppSelector } from '../../hooks';
import { getUserInfo } from '../../store/slices/user/user.selectors';
import { getFavorites } from '../../store/slices/favorites/favorites.selectors';
import styles from './user-link.module.css';

const UserLink = (): JSX.Element => {
  const user = useAppSelector(getUserInfo);
  const favoriteOffersCount = useAppSelector(getFavorites).length;

  return (
    <Link
      className="header__nav-link header__nav-link--profile"
      to={AppRoute.Favorites}
    >
      <div
        data-testid="avatar-wrapper"
        className={`header__avatar-wrapper user__avatar-wrapper ${user?.isPro ? styles.avatarWrapperPro : ''}`}
      >
        <img
          className={styles.avatarImage}
          src={user?.avatarUrl}
          alt={user?.name || 'User avatar'}
        />
      </div>
      <span className="header__user-name user__name">
        {user?.email || user?.name || 'John Doe'}
      </span>
      <span className="header__favorite-count">{favoriteOffersCount}</span>
    </Link>
  );
};

export default UserLink;

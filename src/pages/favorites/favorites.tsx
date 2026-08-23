import { Helmet } from 'react-helmet-async';
import { useAppSelector } from '../../hooks';
import {
  geIsFavoritesLoading,
  getFavorites,
} from '../../store/slices/favorites/favorites.selectors';
import EmptyFavoritesBanner from '../../components/empty-favorites-banner/empty-favorites-banner';
import FavoritesList from '../../components/favorites-list/favorites-list';
import Spinner from '../../components/spinner/spinner';
import classNames from 'classnames';

const Favorites = (): JSX.Element => {
  const favoriteOffers = useAppSelector(getFavorites);
  const isFavoritesLoading = useAppSelector(geIsFavoritesLoading);
  const isEmpty = !isFavoritesLoading && favoriteOffers.length === 0;

  const sectionClass = classNames('favorites', { 'favorites--empty': isEmpty });

  return (
    <div className="page__favorites-container container">
      <Helmet>
        <title>6 Cities | Favorites</title>
      </Helmet>
      <section className={sectionClass}>
        {isFavoritesLoading && <Spinner />}

        {isEmpty && <h1 className="visually-hidden">Favorites (empty)</h1>}
        {!isEmpty && <h1 className="favorites__title">Saved listing</h1>}

        {isEmpty && <EmptyFavoritesBanner />}
        {!isEmpty && <FavoritesList />}
      </section>
    </div>
  );
};

export default Favorites;

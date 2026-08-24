import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '.';
import { useEffect, useMemo } from 'react';
import {
  fetchNearOffersAction,
  fetchOfferAction,
  fetchReviewsAction,
} from '../store/api-actions';
import { AppRoute } from '../const/infrastructure';
import {
  getIsNearOffersLoading,
  getIsOfferLoading,
  getIsOfferLoadingError,
  getNearOffers,
  getOffer,
} from '../store/slices/offer/offer.selectors';
import { getReviews } from '../store/slices/reviews/reviews.selectors';
import { setActiveOfferId } from '../store/slices/app/app.slice';
import { clearOfferPage } from '../store/slices/offer/offer.slice';

const useOfferPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isOfferLoading = useAppSelector(getIsOfferLoading);
  const isOfferLoadingError = useAppSelector(getIsOfferLoadingError);

  const offer = useAppSelector(getOffer);
  const isNearOffersLoading = useAppSelector(getIsNearOffersLoading);
  const nearOffers = useAppSelector(getNearOffers);
  const reviews = useAppSelector(getReviews);

  useEffect(() => {
    let isMounted = true;

    if (id && isMounted) {
      dispatch(fetchOfferAction(id));
      dispatch(fetchNearOffersAction(id));
      dispatch(fetchReviewsAction(id));
      dispatch(setActiveOfferId(id));
    }

    return () => {
      isMounted = false;
    };
  }, [id, dispatch]);

  useEffect(() => {
    let isMounted = true;

    if (isOfferLoadingError && isMounted) {
      navigate(AppRoute.NotFound, { replace: true });
    }

    return () => {
      isMounted = false;
    };
  }, [isOfferLoadingError, navigate]);

  useEffect(
    () => () => {
      dispatch(clearOfferPage());
    },
    [dispatch],
  );

  const mapOffers = useMemo(
    () => (offer ? [...nearOffers, offer] : nearOffers),
    [nearOffers, offer],
  );

  return {
    offer,
    reviews,
    nearOffers,
    mapOffers,
    isOfferLoading,
    isNearOffersLoading,
  };
};

export default useOfferPage;

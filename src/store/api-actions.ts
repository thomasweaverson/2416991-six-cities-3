import { APIRoute, FavoriteStatus } from '../const/infrastructure';
import {
  Offer,
  OfferPreview,
  Review,
  ReviewServer,
  ServerOffer,
} from '../types/offer';
import { dropToken, saveToken } from '../services/token';
import { UserData, AuthData } from '../types/user-data';
import { adaptFavoriteResponseToPreview, adaptOffer } from './utils';
import { MAX_NEAR_OFFERS_COUNT } from '../const/business';
import { clearFavorites } from './slices/favorites/favorites.slice';
import { createAppAsyncThunk } from './create-app-async-thunk';

export const fetchOffersAction = createAppAsyncThunk<OfferPreview[]>(
  'offers/fetchAll',
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferPreview[]>(APIRoute.Offers);
    return data;
  },
);

export const fetchOfferAction = createAppAsyncThunk<Offer, OfferPreview['id']>(
  'offers/fetchSpecified',
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ServerOffer>(`${APIRoute.Offers}/${id}`);
    return adaptOffer(data);
  },
);

export const fetchNearOffersAction = createAppAsyncThunk<
  OfferPreview[],
  OfferPreview['id']
>('nearby/fetchAll', async (id, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<OfferPreview[]>(
    `${APIRoute.Offers}/${id}${APIRoute.Nearby}`,
  );
  return data.slice(0, MAX_NEAR_OFFERS_COUNT);
});

export const fetchReviewsAction = createAppAsyncThunk<
  Review[],
  OfferPreview['id']
>('review/fetchAll', async (id, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${id}`);
  return data;
});

export const postReviewAction = createAppAsyncThunk<Review, ReviewServer>(
  'review/post',
  async ({ id, comment, rating }, { extra }) => {
    const { api } = extra;

    const { data } = await api.post<Review>(`${APIRoute.Comments}/${id}`, {
      comment,
      rating,
    });
    return data;
  },
);

export const fetchFavoritesAction = createAppAsyncThunk<OfferPreview[]>(
  'favorites/fetchAll',
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferPreview[]>(APIRoute.Favorite);
    return data;
  },
);

export const changeFavoriteStatusAction = createAppAsyncThunk<
  OfferPreview,
  {
    offerId: OfferPreview['id'];
    status: FavoriteStatus;
  }
>(
  'favorites/changeStatus',
  async ({ offerId, status }, { extra, getState }) => {
    const { api } = extra;
    const { data } = await api.post<ServerOffer>(
      `${APIRoute.Favorite}/${offerId}/${status}`,
    );

    const state = getState();
    const existingOffer = state?.Offers?.offers?.find(
      (item) => item.id === offerId,
    );

    const adaptedPreviewOffer = adaptFavoriteResponseToPreview(
      data,
      status,
      existingOffer?.previewImage,
    );

    return existingOffer
      ? { ...existingOffer, ...adaptedPreviewOffer }
      : adaptedPreviewOffer;
  },
);

export const checkAuthAction = createAppAsyncThunk<UserData>(
  'user/checkAuth',
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<UserData>(APIRoute.Login);
    return data;
  },
);

export const loginAction = createAppAsyncThunk<UserData, AuthData>(
  'user/login',
  async ({ email: email, password }, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<UserData>(APIRoute.Login, {
      email,
      password,
    });
    saveToken(data.token);
    return data;
  },
);

export const logoutAction = createAppAsyncThunk<void>(
  'user/logout',
  async (_arg, { dispatch, extra }) => {
    const { api } = extra;
    await api.delete(APIRoute.Logout);
    dispatch(clearFavorites());
    dropToken();
  },
);

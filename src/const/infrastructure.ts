export const BACKEND_URL = 'https://15.design.htmlacademy.pro/six-cities';

export const REQUEST_TIMEOUT = 5000;

export const AppRoute = {
  Root: '/',
  Login: '/login',
  Favorites: '/favorites',
  Offer: '/offer',
  NotFound: '/404',
} as const;

export const AuthorizationStatus = {
  Auth: 'AUTH',
  NoAuth: 'NO_AUTH',
  Unknown: 'UNKNOWN',
} as const;

export const APIRoute = {
  Offers: '/offers',
  Nearby: '/nearby',
  Favorite: '/favorite',
  Comments: '/comments',
  Login: '/login',
  Logout: '/logout',
} as const;

export enum FavoriteStatus {
  No = 0,
  Yes = 1,
}

export enum NameSpace {
  Offers = 'Offers',
  Offer = 'Offer',
  App = 'App',
  Reviews = 'Reviews',
  Favorites = 'Favorites',
  User = 'User',
}

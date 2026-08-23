import { MAX_PERCENT_STARS_WIDTH, MAX_RATING } from '../../const/business';

export const getStarsWidth = (rating: number) =>
  `${(MAX_PERCENT_STARS_WIDTH * Math.round(rating)) / MAX_RATING}%`;

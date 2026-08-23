import {
  MAX_RATING,
  MAX_REVIEW_CHARACTERS,
  MIN_REVIEW_CHARACTERS,
} from '../../const/business';
import { ReviewFormData } from '../../types/offer';

export const validateReviewForm = (reviewFormData: ReviewFormData) =>
  reviewFormData.comment.length >= MIN_REVIEW_CHARACTERS &&
  reviewFormData.comment.length <= MAX_REVIEW_CHARACTERS &&
  reviewFormData.rating > 0 &&
  reviewFormData.rating <= MAX_RATING;

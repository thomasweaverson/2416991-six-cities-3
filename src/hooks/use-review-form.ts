import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateReviewForm } from '../components/review-form/utils';
import { useAppDispatch } from '.';
import { postReviewAction } from '../store/api-actions';
import { ReviewFormData } from '../types/offer';

const INITIAL_FORM_STATE: ReviewFormData = {
  comment: '',
  rating: 0,
};

const useReviewForm = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<ReviewFormData>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = validateReviewForm(formData);

  const handleRatingChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const rating = Number(evt.target.value);
      setFormData((prev) => ({ ...prev, rating }));
    },
    [],
  );

  const handleTextChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const comment = evt.target.value;
    setFormData((prev) => ({ ...prev, comment }));
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!id || !isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    dispatch(
      postReviewAction({
        rating: formData.rating,
        comment: formData.comment,
        id,
      }),
    )
      .unwrap()
      .then(() => {
        setFormData(INITIAL_FORM_STATE);
      })
      .catch(() => {
        toast.warn(
          'A technical error occurred while submitting the form; please try again later.',
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return {
    formData,
    isValid,
    isSubmitting,
    handleRatingChange,
    handleTextChange,
    handleSubmit,
  };
};

export default useReviewForm;

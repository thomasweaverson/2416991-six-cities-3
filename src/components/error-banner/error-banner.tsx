import classNames from 'classnames';
import { useAppDispatch } from '../../hooks';
import { fetchOffersAction } from '../../store/api-actions';
import styles from './error-banner.module.css';

const ErrorBanner = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleButtonClick = () => {
    dispatch(fetchOffersAction());
  };

  const buttonClass = classNames('button', styles.button);

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <p className={styles.text}>Failed to load offers</p>
        <button
          type="button"
          className={buttonClass}
          onClick={handleButtonClick}
        >
          Try again
        </button>
      </div>
    </section>
  );
};

export default ErrorBanner;

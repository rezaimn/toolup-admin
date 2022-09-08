import { FC } from 'react';
/* components */
/* modules */
import { PathType, routeTo } from 'Helpers/routeTo';
import { Link } from 'react-router-dom';
/* helpers */
/* assets */
import { logo } from 'assets/icons';
import { ReactComponent as ErrorIcon } from 'assets/icons/error.svg';
/* styles */
import styles from './styles.module.scss';

/* types */
export type CommonErrorProps = {
    title: string;
    message: string;
    link: PathType;
};
export type ErrorProps = CommonErrorProps;

export const Error: FC<ErrorProps> = ({ title, message, link }) => {
    return (
        <div className={styles.errorWrap}>
            <div className={styles.logoWrap}>
                <img src={logo} alt='logo' />
                <p className={styles.logoText}>Toolup</p>
            </div>
            <div className={styles.content}>
                <ErrorIcon className={styles.logo} />
                <p className={styles.title}>{title}</p>
                <p className={styles.message}>{message}</p>
                <Link to={routeTo(link)}>
                    <button className={styles.button} type='button'>
                        Go Home
                    </button>
                </Link>
            </div>
        </div>
    );
};

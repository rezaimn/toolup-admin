import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { Link } from 'react-router-dom';
/* modules */
import cn from 'clsx';
/* helpers */
import { routeTo } from 'Helpers/routeTo';
/* assets */
import { ReactComponent as WrenchIcon } from 'assets/icons/wrench.svg';
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonToolManagementAddButtonProps = {};
export type ToolManagementAddButtonProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonToolManagementAddButtonProps
> &
    CommonToolManagementAddButtonProps;

export const ToolManagementAddButton: FC<ToolManagementAddButtonProps> = ({
    className,
    ...restProps
}) => {
    return (
        <Link
            className={cn(className, styles.addTool)}
            to={routeTo('addTool', { id: 0 })}
        >
            <WrenchIcon className={styles.icon} />
            <p className={styles.title}>Add a tool</p>
        </Link>
    );
};

import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { Link } from 'react-router-dom';
/* modules */
import cn from 'clsx';
import { Tool } from 'Hooks/api';
/* helpers */
import { routeTo } from 'Helpers/routeTo';
/* assets */

/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonToolManagementToolItemProps = Tool & {
    isCustomTool?: boolean;
    isStatic?: boolean;
};

export type ToolManagementToolItemProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonToolManagementToolItemProps
> &
    CommonToolManagementToolItemProps;

export const ToolManagementToolItem: FC<ToolManagementToolItemProps> = ({
    className,
    icon,
    name: toolName,
    url,
    id: toolId,
    isCustomTool = false,
    isStatic,
    ...restProps
}) => {
    if (isStatic) {
        return (
            <a
                rel='noreferrer'
                href={url}
                target='_blank'
                className={cn(className, styles.tool)}
            >
                <img className={styles.icon} src={icon} alt={toolName} />
                <p className={styles.name}>{toolName}</p>

                {isCustomTool && (
                    <div className={styles.originBanner}>Custom</div>
                )}
            </a>
        );
    }
    return (
        <Link
            to={routeTo('editTool', { toolId })}
            className={cn(className, styles.tool)}
        >
            <img className={styles.icon} src={icon} alt={toolName} />
            <p className={styles.name}>{toolName}</p>

            {isCustomTool && <div className={styles.originBanner}>Custom</div>}
        </Link>
    );
};

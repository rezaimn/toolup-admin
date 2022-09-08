import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { Badge } from 'Components/Atoms/Badge';
/* modules */
import cn from 'clsx';
import { BoardingTool } from 'Hooks/api';
/* helpers */
/* assets */
import ToolImagePlaceholderIcon from 'assets/icons/tool-image-placeholder.svg';
/* styles */
import s from './styles.module.scss';

/* types */
export type CommonDashboardToolsListItemProps = {
    tool?: BoardingTool;
    count?: number;
    text?: string;
};
export type DashboardToolsListItemProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDashboardToolsListItemProps
> &
    CommonDashboardToolsListItemProps;

export const DashboardToolsListItem: FC<DashboardToolsListItemProps> = ({
    className,
    tool,
    count,
    text,
    ...restProps
}) => {
    if (count) {
        return (
            <div className={cn(className, s.item)}>
                <div className={s.icon}>+{count}</div>
                <p className={s.name}>{text}</p>
            </div>
        );
    }
    return (
        <div className={cn(className, s.item)} title={tool?.name}>
            <Badge count={tool?.boarding_count}>
                <img
                    className={s.icon || ToolImagePlaceholderIcon}
                    src={tool?.icon}
                    alt={tool?.name}
                />
            </Badge>
            <p className={s.name}>{tool?.name}</p>
        </div>
    );
};

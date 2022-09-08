import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { ToolManagementToolItem } from 'Components/Molecules/ToolManagementToolItem';
import { ToolManagementAddButton } from 'Components/Molecules/ToolManagementAddButton';
/* modules */
import cn from 'clsx';
import { concat, map } from 'lodash/fp';
import { Tool } from 'Hooks/api';
/* helpers */
import { isNormalUser } from 'Services/RBAC/config';
/* assets */
import SlackIcon from 'assets/icons/slack.svg';
import ToolImagePlaceholderIcon from 'assets/icons/tool-image-placeholder.svg';

/* styles */
import styles from './styles.module.scss';

/* types */
export type CommonToolManagementToolsListProps = {
    tools: Tool[];
    withAddTool?: boolean;
};
export type ToolManagementToolsListProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonToolManagementToolsListProps
> &
    CommonToolManagementToolsListProps;

export const ToolManagementToolsList: FC<ToolManagementToolsListProps> = ({
    className,
    tools,
    withAddTool = true,
    ...restProps
}) => {
    const data = map<Tool, JSX.Element>(tool => (
        <div className={styles.item} key={tool.id.toString()}>
            <ToolManagementToolItem
                icon={tool.icon || ToolImagePlaceholderIcon}
                name={tool.name}
                url={tool.url}
                categories={tool.categories}
                created_at={tool.created_at}
                id={tool.id}
                members_count={tool.members_count}
                organization_id={tool.organization_id}
                origin={tool.origin}
                teams_count={tool.teams_count}
                type={tool.type}
                updated_at={tool.updated_at}
                isCustomTool={tool.origin !== 'SYSTEM'}
                isStatic={isNormalUser()}
            />
        </div>
    ))(tools);

    const addButton = withAddTool && (
        <ToolManagementAddButton className={styles.item} />
    );

    return (
        <div className={cn(className, styles.list)}>
            {concat(addButton)(data)}
        </div>
    );
};

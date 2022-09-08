import React, {
    ComponentPropsWithoutRef,
    FC,
    useEffect,
    createRef,
} from 'react';
/* components */
import { DashboardSidebarProfile } from 'Components/Molecules/DashboardSidebarProfile';
import { DashboardToolsSidebarItem } from 'Components/Molecules/DashboardToolsSidebarItem';
import { EmptyCardSign } from 'Components/Molecules/EmptyCardSign';
import { Spinner } from 'Components/Atomes/Spinner';
import { Left } from '@icon-park/react';
/* modules */
import cn from 'clsx';
import { useUserTools, Tool, useCurrentUserDetails } from 'Hooks/api';
/* helpers */
import { map, flow, slice } from 'lodash/fp';
/* assets */
import { ReactComponent as ToolsSidebarToggler } from 'assets/icons/chevron-left.svg';
/* styles */
import s from './styles.module.scss';

/* types */
export type CommonDashboardToolsSidebarProps = {
    collapsed: boolean;
    toggleCollapseState: () => void;
    showSidebar: boolean;
    toggleSidebar: () => void;
};
export type DashboardToolsSidebarProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDashboardToolsSidebarProps
> &
    CommonDashboardToolsSidebarProps;

// const useTouch = (ref: any, callback: any) => {
//     const handleTouch = (e: any) => {
//         callback();
//     };

//     useEffect(() => {
//         document.addEventListener('touchmove', handleTouch, false);

//         return () => {
//             document.removeEventListener('touchmove', handleTouch, false);
//         };
//     });
// };

export const DashboardToolsSidebar: FC<DashboardToolsSidebarProps> = ({
    className,
    collapsed,
    toggleCollapseState,
    toggleSidebar,
    showSidebar,
    ...restProps
}) => {
    /* REVIEW convert this part to a hook */
    //const ref = createRef<HTMLDivElement>();

    // useTouch(ref, () => {
    //     toggleSidebar();
    // });

    const showingCount = collapsed ? 7 : Infinity;

    const { data: tools = [], isLoading: userToolsIsLoading } = useUserTools({
        staleTime: 600_000,
    });
    const {
        data: currentUserDetails,
        isLoading: currentUserDetailsIsLoading,
    } = useCurrentUserDetails();

    return (
        <div style={{ position: 'fixed', top: 0, bottom: 0, right: 0 }}>
            <div
                onClick={() => {
                    toggleSidebar();
                }}
                //ref={ref}
                className={cn(s.handler)}
            >
                <Left
                    theme='filled'
                    size='25'
                    fill='#FFF'
                    className='margin-auto'
                />
            </div>
            <div
                className={cn(
                    className,
                    s.sidebar,
                    { [s.collapsed]: collapsed },
                    { [s.show]: showSidebar },
                    { [s.unCollapsed]: !collapsed },
                    { 'shadow-xl': !collapsed },
                    'lg:flex',
                    'absolute',
                    'lg:relative',
                    'flex-col',
                    'shadow-md',
                    'bg-white',
                    'duration-500',
                    // 'items-center',
                    'px-0'
                )}
                //ref={ref}
            >
                <DashboardSidebarProfile
                    className={cn('mt-20')}
                    isCollapsed={collapsed}
                    {...currentUserDetails!}
                />
                <ToolsSidebarToggler
                    onClick={() => {
                        if (showSidebar) {
                            toggleSidebar();
                        } else {
                            toggleCollapseState();
                        }
                    }}
                    className={cn(
                        s.toggler,
                        'absolute',
                        'top-20',
                        'transform ',
                        'cursor-pointer',
                        'duration-500',
                        { 'rotate-180': collapsed },
                        { 'rotate-180': !showSidebar && collapsed },
                        { [s['toggler--isCollapsed']]: collapsed }
                    )}
                />

                <p
                    aria-label='title'
                    className={cn(
                        'text-blue-500',
                        'font-bold',
                        'text-center',
                        'text-base'
                    )}
                >
                    Your Tools
                </p>
                <div>
                    <div
                        className={cn(
                            'mt-20',
                            'flex',
                            'flex-wrap',
                            'justify-center',
                            'w-full',
                            'h-full',
                            'overflow-auto',
                            'content-start'
                        )}
                        style={{
                            height: collapsed
                                ? 'calc(100vh - 250px)'
                                : 'calc(100vh - 280px)',
                        }}
                    >
                        {userToolsIsLoading ? (
                            <Spinner />
                        ) : (
                            renderSidebarToolsList(
                                showingCount,
                                tools,
                                collapsed
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const renderSidebarToolsList = (
    showingCount: number,
    tools: Tool[],
    collapsed: boolean
): JSX.Element => {
    if (!tools?.length) {
        return (
            <EmptyCardSign
                showMainTitle={!collapsed}
                title='You have no tools'
                leanTitle='No tools'
                subtitle='Please select the desired tools from the tool management section'
            />
        );
    }
    return flow(
        slice(0, showingCount),
        map<Tool, JSX.Element>(tool => (
            <DashboardToolsSidebarItem collapsed={collapsed} {...tool} />
        ))
    )(tools);
};

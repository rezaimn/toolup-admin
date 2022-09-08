import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { Card } from 'Components/Atomes/Card';
import {
    CommonDashboardSuggestedToolItemProps,
    DashboardSuggestedToolItem,
} from 'Components/Molecules/DashboardSuggestedToolItem';
import { EmptyCardSign } from 'Components/Molecules/EmptyCardSign';
import { Spinner } from 'Components/Atomes/Spinner';
/* modules */
import cn from 'clsx';
import { Tool, useSuggestedTools } from 'Hooks/api';
import { routeTo } from 'Helpers/routeTo';
import { NavLink } from 'react-router-dom';
/* helpers */
import { map, isEqual } from 'lodash/fp';
/* assets */
import Wave from 'assets/icons/wave.svg';
import IDUSoft from 'assets/icons/idu-soft.svg';
import PicMonkey from 'assets/icons/picMonkey.svg';
import MicrosoftTeams from 'assets/icons/microsoft-teams.svg';
import InVision from 'assets/icons/invision.svg';
import TravisCI from 'assets/icons/travis-ci.svg';
import QuickbooksDesktopPro from 'assets/icons/quickbooks-desktop-pro.svg';
import InvoiceBerry from 'assets/icons/invoice-berry.svg';

/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonDashboardSuggestedToolsProps = {};
export type DashboardSuggestedToolsProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDashboardSuggestedToolsProps
> &
    CommonDashboardSuggestedToolsProps;

export const DashboardSuggestedTools: FC<DashboardSuggestedToolsProps> = ({
    className,
    ...restProps
}) => {
    const {
        data: recommendedTools,
        isFetching: recommendedToolsIsLoading,
    } = useSuggestedTools();

    if (recommendedToolsIsLoading || !recommendedTools) {
        return (
            <Card className={cn(className)} title='Suggested Tools'>
                <div className={styles.tools}>
                    <Spinner />
                </div>
            </Card>
        );
    }

    if (
        isEqual(0)(recommendedTools.length) &&
        isEqual(false)(recommendedToolsIsLoading)
    ) {
        return (
            <Card className={cn(className)} title='Suggested Tools'>
                <div className={styles.tools}>
                    <EmptyCardSign title='No tools found' />
                </div>
            </Card>
        );
    }

    const data = map<Tool, JSX.Element>(tool => {
        return (
            <div
                className={cn(
                    'p-10',
                    'w-full',
                    'md:w-1/2',
                    'lg:w-1/5 cursor-pointer'
                )}
                key={tool.id}
            >
                <NavLink
                    to={routeTo('addTool', {
                        id: tool.id,
                    })}
                >
                    <DashboardSuggestedToolItem
                        name={tool.name}
                        status='Recommended'
                        icon={tool.icon}
                    />
                </NavLink>
            </div>
        );
    })(recommendedTools);

    return (
        <Card className={cn(className)} title='Suggested Tools'>
            <div className='mt-20 flex items-stretch space-x-0 flex-wrap'>
                {data}
            </div>
        </Card>
    );
};

type Tools = {
    status: CommonDashboardSuggestedToolItemProps['status'];
    name: string;
    id: string;
    img: string;
};

// const tools: Tools[] = [
//     {
//         id: '1',
//         name: 'Jira',
//         status: 'New',
//         img: 'https://toolup.s3.us-east-2.amazonaws.com/public/icons/jira.png',
//     },
//     {
//         id: '2',
//         name: 'QuickBooks',
//         status: 'New',
//         img: QuickbooksDesktopPro,
//     },
//     {
//         id: '3',
//         name: 'Travis CI',
//         status: '',
//         img: TravisCI,
//     },
//     {
//         id: '4',
//         name: 'Wave',
//         status: '',
//         img: Wave,
//     },
//     {
//         id: '5',
//         name: 'Adobe XD',
//         status: '',
//         img:
//             'https://toolup.s3.us-east-2.amazonaws.com/public/icons/adobexd.png',
//     },
//     {
//         id: '6',
//         name: 'Canva',
//         status: '',
//         img: 'https://toolup.s3.us-east-2.amazonaws.com/public/icons/canva.png',
//     },
//     {
//         id: '7',
//         name: 'PicMonkey',
//         status: 'Trend',
//         img: PicMonkey,
//     },
//     {
//         id: '8',
//         name: 'InVision',
//         status: '',
//         img: InVision,
//     },
//     {
//         id: '9',
//         name: 'Microsoft teams',
//         status: 'Recommended',
//         img: MicrosoftTeams,
//     },
//     {
//         id: '10',
//         name: 'Figma',
//         status: '',
//         img: 'https://toolup.s3.us-east-2.amazonaws.com/public/icons/figma.png',
//     },
// ];

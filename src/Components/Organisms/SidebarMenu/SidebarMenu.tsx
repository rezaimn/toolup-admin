import React, {
    ComponentPropsWithoutRef,
    FC,
    useState,
    createRef,
    useEffect,
} from 'react';
/* components */
import { Tooltip } from '@material-ui/core';
import { SidebarCompanyLogo } from 'Components/Molecules/SidebarCompanyLogo';
import { Setting } from '@icon-park/react';
import { generatePath } from 'react-router-dom';
import get from 'lodash/get';
/* modules */
import { ROUTES } from 'Constants/routes';
import { isAdmin } from 'Services/RBAC/config';
/* helpers */
import { routeTo } from 'Helpers/routeTo';
import { isEqual, startsWith } from 'lodash/fp';
import { useLocation, NavLink } from 'react-router-dom';
import map from 'lodash/map';
/* assets */
import { ReactComponent as Dashboard } from 'assets/icons/dashboard.svg';
import { ReactComponent as Members } from 'assets/icons/member.svg';
import { ReactComponent as Tool } from 'assets/icons/tool.svg';
import { ReactComponent as Team } from 'assets/icons/team.svg';
import { ReactComponent as Teams } from 'assets/icons/team-tool.svg';
import { ReactComponent as Onboarding } from 'assets/icons/onboarding.svg';
import { ReactComponent as MenuFold } from 'assets/icons/menu-fold.svg';
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonSidebarMenuProps = {};
export type SidebarMenuProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSidebarMenuProps
> &
    CommonSidebarMenuProps;

const useOutsideClick = (ref: any, callback: any) => {
    const handleClick = (e: any) => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    });
};

export const SidebarMenu: FC<SidebarMenuProps> = ({
    className,
    ...restProps
}) => {
    const location = useLocation();
    const currentLocation = location.pathname;
    const selectedColor = '#fff';
    const normalColor = '#D5D5D5';
    const [showMenu, setShowMenu] = useState(false);
    const ref = createRef<HTMLDivElement>();
    useOutsideClick(ref, () => {
        setShowMenu(false);
    });
    const adminMenu = [
        {
            route: 'dashboard',
            title: 'Dashboard',
            icon: (
                <Dashboard
                    fill={
                        currentLocation ===
                        generatePath(get(ROUTES, 'dashboard'))
                            ? selectedColor
                            : normalColor
                    }
                    stroke={
                        currentLocation ===
                        generatePath(get(ROUTES, 'dashboard'))
                            ? selectedColor
                            : normalColor
                    }
                />
            ),
        },
        {
            route: 'members',
            title: 'Members',
            icon: (
                <Members
                    fill={
                        currentLocation === generatePath(get(ROUTES, 'members'))
                            ? selectedColor
                            : normalColor
                    }
                    stroke={
                        currentLocation === generatePath(get(ROUTES, 'members'))
                            ? selectedColor
                            : normalColor
                    }
                />
            ),
        },
        {
            route: 'tools',
            title: 'Teams’ Tools',
            icon: (
                <Setting
                    theme='filled'
                    size='25'
                    fill={
                        currentLocation === generatePath(get(ROUTES, 'tools'))
                            ? selectedColor
                            : normalColor
                    }
                />
            ),
        },
        {
            route: 'toolsManagement',
            title: 'Tools',
            icon: (
                <Tool
                    fill={
                        currentLocation ===
                        generatePath(get(ROUTES, 'toolsManagement'))
                            ? selectedColor
                            : normalColor
                    }
                    stroke={
                        currentLocation ===
                        generatePath(get(ROUTES, 'toolsManagement'))
                            ? selectedColor
                            : normalColor
                    }
                />
            ),
        },
        {
            route: 'teams',
            title: 'teams',
            icon: (
                <Team
                    fill={
                        currentLocation === generatePath(get(ROUTES, 'teams'))
                            ? selectedColor
                            : normalColor
                    }
                    stroke={
                        currentLocation === generatePath(get(ROUTES, 'teams'))
                            ? selectedColor
                            : normalColor
                    }
                />
            ),
        },
        {
            route: 'onboardingOffboarding',
            title: 'Onboarding/Offboarding',
            icon: (
                <Onboarding
                    fill={
                        currentLocation ===
                        generatePath(get(ROUTES, 'onboardingOffboarding'))
                            ? selectedColor
                            : normalColor
                    }
                    stroke={
                        currentLocation ===
                        generatePath(get(ROUTES, 'onboardingOffboarding'))
                            ? normalColor
                            : selectedColor
                    }
                />
            ),
        },
    ];
    const normalUserMenu = [
        {
            route: 'dashboard',
            title: 'Dashboard',
            icon: (
                <Dashboard
                    fill={
                        currentLocation ===
                        generatePath(get(ROUTES, 'dashboard'))
                            ? selectedColor
                            : normalColor
                    }
                    stroke={
                        currentLocation ===
                        generatePath(get(ROUTES, 'dashboard'))
                            ? selectedColor
                            : normalColor
                    }
                />
            ),
        },
    ];
    return (
        <div
            className={styles.wrapper}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 10,
            }}
        >
            <div
                className={styles.menuButton}
                onClick={() => setShowMenu(true)}
            >
                <MenuFold />
            </div>
            <div className={showMenu ? styles.sidebarShadow : ''} />
            <div
                ref={ref}
                className={`${styles.menu} ${showMenu && styles.showMenu}`}
            >
                <SidebarCompanyLogo />
                {map(isAdmin() ? adminMenu : normalUserMenu, item => {
                    return (
                        <Tooltip title={item.title} placement='right'>
                            <NavLink
                                to={generatePath(get(ROUTES, item.route))}
                                className='h-56 w-56 mb-26 flex justify-center items-center rounded-md duration-75 hover:bg-blue-900'
                                activeClassName='bg-blue-900'
                            >
                                {item.icon}
                            </NavLink>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
};

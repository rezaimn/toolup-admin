/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

/* components */
import { DashboardToolsSidebar } from 'Components/Organisms/DashboardToolsSidebar';
import { SidebarMenu } from 'Components/Organisms/SidebarMenu';
import { DashboardLayoutFooter } from 'Components/Molecules/DashboardLayoutFooter';

/* modules */
import cn from 'clsx';

import { isAdmin } from 'Services/RBAC/config';
import { Breadcrumb } from 'Components/Organisms/Breadcrumb';
import { SetupProcessBanner } from 'Components/Organisms/SetupProcessBanner';
import styles from './styles.module.scss';

const HomePage = ({ children, breadcrumbs, ...restProps }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const toggleCollapseState = () => {
        setCollapsed(c => !c);
    };
    const toggleSidebar = () => {
        setShowSidebar(c => !c);
    };

    useEffect(() => {
        if (window.innerWidth < 768) {
            setCollapsed(false);
        }
    }, []);

    return (
        <div className={styles.wrapper}>
            <CssBaseline />
            <SidebarMenu />
            <div className={`${styles.contentWrapper} ${styles.admin}`}>
                <main
                    className={`${styles.content} flex xl:w-full min-h-screen mt-20 lg:mt-0`}
                >
                    <div className='content-header mb-20 ml-104'>
                        <SetupProcessBanner />

                        {breadcrumbs && (
                            <Breadcrumb
                                breadcrumbs={breadcrumbs}
                                {...restProps}
                            />
                        )}
                    </div>
                    <div
                        className='content-body  ml-104'
                        style={{ width: 'calc ( 100vw - 104px )' }}
                    >
                        {children}
                    </div>
                </main>
            </div>
            <DashboardToolsSidebar
                collapsed={collapsed}
                toggleCollapseState={toggleCollapseState}
                showSidebar={showSidebar}
                toggleSidebar={toggleSidebar}
            />
        </div>
    );
};

HomePage.defaultProps = {
    title: '',
};
export default HomePage;

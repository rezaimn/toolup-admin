/* eslint-disable */
import React, {
    ChangeEvent,
    ComponentPropsWithoutRef,
    FC,
    useEffect,
    useState,
    createRef,
} from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { useChangeAvatar, User, useLogout } from 'Hooks/api';
import { capitalize, last } from 'lodash/fp';
import { Spinner } from 'Components/Atomes/Spinner';
import { Menu } from 'Components/Atoms/Menu';

/* helpers */
/* assets */
// import { ReactComponent as ChangeAvatarIcon } from 'assets/icons/change-avatar.svg';
import { ReactComponent as ChangeAvatarIcon } from 'assets/icons/camera.svg';
import AvatarIcon from 'assets/icons/avatar.svg';
import { routeTo } from 'Helpers/routeTo';
import { Link, useHistory } from 'react-router-dom';
import { Dropdown } from 'Components/Atoms/Dropdown';
/* styles */
/* types */
export type CommonDashboardSidebarProfileProps = {
    isCollapsed: boolean;
} & User;

export type DashboardSidebarProfileProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDashboardSidebarProfileProps
> &
    CommonDashboardSidebarProfileProps;

export const DashboardSidebarProfile: FC<DashboardSidebarProfileProps> = ({
    className,
    isCollapsed,
    last_name,
    first_name,
    avatar,
    ...restProps
}) => {
    const [open, setOpen] = useState(false);
    const { mutate: logout } = useLogout();
    const history = useHistory();

    const {
        mutate: changeAvatar,
        isLoading: changeAvatarIsLoading,
    } = useChangeAvatar();

    /* REVIEW @mahmood.b review this part, it's not clean */
    const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedAvatarFile = last(e.target.files);
        if (!selectedAvatarFile) return;
        const avatar = new FormData();
        avatar.append('avatar', selectedAvatarFile);
        changeAvatar({ avatar });
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <label htmlFor='profile'>
                    <div>Change Avatar</div>
                </label>
            </Menu.Item>
            <Menu.Item>
                <Link to={routeTo('profile')}>Profile & Preferences</Link>
            </Menu.Item>
            <Menu.Item onClick={logout}>
                <span>Logout</span>
            </Menu.Item>
        </Menu>
    );

    return (
        <div
            className={cn(
                className,
                'flex',
                'flex-col',
                'items-center',
                'w-full',
                'mt-50'
            )}
        >
            {changeAvatarIsLoading ? (
                <Spinner
                    className={cn(
                        { 'h-103': !isCollapsed },
                        { 'w-103': !isCollapsed },
                        { 'h-57': isCollapsed },
                        { 'w-57': isCollapsed },
                        'flex',
                        'items-center',
                        'justify-center'
                        // 'mt-50'
                    )}
                />
            ) : (
                <Dropdown overlay={menu} placement='bottomCenter'>
                    <div className={cn('relative')}>
                        <img
                            aria-label='profile-image'
                            src={avatar || AvatarIcon}
                            onClick={() => setOpen(!open)}
                            className={cn(
                                { 'h-103': !isCollapsed },
                                { 'w-103': !isCollapsed },
                                { 'h-57': isCollapsed },
                                { 'w-57': isCollapsed },
                                'bg-gray-100',
                                'rounded-full',
                                // 'mt-50',
                                'cursor-pointer'
                            )}
                        />
                        <ChangeAvatarIcon
                            style={{ stroke: '#747474' }}
                            onClick={() => setOpen(!open)}
                            className={cn(
                                'absolute',
                                { hidden: isCollapsed },
                                { 'h-20': isCollapsed },
                                { 'w-20': isCollapsed },
                                { 'h-25': !isCollapsed },
                                { 'w-25': !isCollapsed },
                                'right-0',
                                { '-bottom-0': !isCollapsed },
                                {
                                    '-bottom-10': isCollapsed,
                                }
                            )}
                        />
                    </div>
                </Dropdown>
            )}

            <input
                className={cn('hidden')}
                onChange={onAvatarChange}
                id='profile'
                type='file'
                accept='image/*'
            />

            <div
                aria-label='role'
                className={cn('text-lg', 'mt-10', { hidden: isCollapsed })}
            >
                {capitalize(first_name)} {capitalize(last_name)}
            </div>

            <div
                aria-label='seprator'
                className={cn(
                    'w-full',
                    'h-1',
                    'w-full',
                    'bg-gray-100',
                    'my-30'
                )}
            />
        </div>
    );
};

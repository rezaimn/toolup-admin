import React, { ComponentPropsWithoutRef, FC, ChangeEvent } from "react";
/* components */
/* modules */
import { Tabs } from 'Components/Atoms/Tabs';
import { Button } from 'Components/Atoms/Button';
import { capitalize, last } from 'lodash/fp';
import { useChangeAvatar, useCurrentUserDetails, User } from 'Hooks/api';
import { ProfileForm } from 'Components/Organisms/ProfileForm';
import { MemberPasswordManagement } from 'Components/Organisms/MemberPasswordManagement';
/* helpers */
/* assets */
import AvatarIcon from 'assets/icons/avatar.svg';
/* styles */
import styles from './styles.module.scss';
import { useCheckPasswordServiceActivation } from "Hooks/api/passwordManagement";
import { queryClient } from "Services/ReactQueryService";
import API_URLS from "Constants/apiUrls";
/* types */
const { TabPane } = Tabs;

export type CommonMemberProfileTabsProps = {}
export type MemberProfileTabsProps = Omit<ComponentPropsWithoutRef<'div'>,
    keyof CommonMemberProfileTabsProps
> &
    CommonMemberProfileTabsProps;

export const MemberProfileTabs: FC<MemberProfileTabsProps> = ({ className, ...restProps }) => {
    const currentUserDetails = queryClient.getQueryData<User>(API_URLS.user);

    const {
        mutate: changeAvatar,
    } = useChangeAvatar();

    const {
        data: activationData,
    } = useCheckPasswordServiceActivation();
    console.log(activationData);

    const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedAvatarFile = last(e.target.files);
        if (!selectedAvatarFile) return;
        const avatar = new FormData();
        avatar.append('avatar', selectedAvatarFile);
        changeAvatar({ avatar });
    };
    return <div className={styles.wrapper}>
        <div className={styles.headerForm}>
            <div className={styles.avatar}>
                <label htmlFor='profile'>
                    <img
                        role='menuitem'
                        aria-label='profile-image'
                        src={currentUserDetails?.avatar || AvatarIcon}
                        className='h-234 w-234 bg-gray-100 rounded-full cursor-pointer'
                    />
                </label>
            </div>
            <input
                className='hidden'
                onChange={onAvatarChange}
                id='profile'
                type='file'
                accept='image/*'
            />
            <div className={styles.userData}>
                <div className={styles.email}>
                    {currentUserDetails?.email}
                </div>
                <div className={styles.name}>
                    {`${currentUserDetails?.first_name} ${currentUserDetails?.last_name}`}
                </div>
                <Button className={styles.changeButton}>
                    CHANGE PICTURE
                    </Button>

            </div>
        </div>
        <div className={styles.tabWrapper}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Profile" key="1">
                    <ProfileForm
                        first_name={currentUserDetails?.first_name}
                        last_name={currentUserDetails?.last_name}
                        email={currentUserDetails?.email}
                    />
                </TabPane>
                {
                    activationData?.serviceActivationStatus && <TabPane tab="Password management" key="2">
                        <MemberPasswordManagement />
                    </TabPane>
                }
            </Tabs>
        </div>
    </div>;

};
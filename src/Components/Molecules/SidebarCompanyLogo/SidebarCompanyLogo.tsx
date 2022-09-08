import React, { ChangeEvent, ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { useChangeLogo, useOrganization } from 'Hooks/api';
import { Spinner } from 'Components/Atomes/Spinner';
import { isAdmin } from 'Services/RBAC/config';
/* helpers */
/* assets */
import { capitalize, last } from 'lodash/fp';
import { yourLogo } from 'assets/icons';
/* styles */
/* types */
export type CommonSidebarCompanyLogoProps = {};
export type SidebarCompanyLogoProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSidebarCompanyLogoProps
> &
    CommonSidebarCompanyLogoProps;

export const SidebarCompanyLogo: FC<SidebarCompanyLogoProps> = ({
    className,
    ...restProps
}) => {
    const {
        data: organization = {
            logo: '',
        },
        isLoading: LogoLoading,
    } = useOrganization();

    const {
        mutate: changeLogo,
        isLoading: changeLogoIsLoading,
    } = useChangeLogo();

    const onLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedLogoFile = last(e.target.files);
        if (!selectedLogoFile) return;
        const logo = new FormData();
        logo.append('logo', selectedLogoFile);
        changeLogo({ logo });
    };

    return (
        <div className={cn('my-20')}>
            <label className={cn('mt-50')} htmlFor='logo'>
                {changeLogoIsLoading || LogoLoading ? (
                    <Spinner
                        className={cn(
                            'flex',
                            'items-center',
                            'justify-center'
                            // 'mt-50'
                        )}
                    />
                ) : (
                    <div className={cn('relative')}>
                        <img
                            aria-label='profile-image'
                            src={organization.logo || yourLogo}
                            className={cn(
                                'w-80',
                                !organization.logo && 'h-60',
                                organization.logo && 'h-80',
                                isAdmin() && 'cursor-pointer'
                            )}
                        />
                        {!organization.logo && (
                            <div className='text-xs text-gray-400'>
                                company logo
                            </div>
                        )}
                    </div>
                )}
            </label>
            {isAdmin() && (
                <input
                    className={cn('hidden')}
                    onChange={onLogoChange}
                    id='logo'
                    type='file'
                    accept='image/*'
                />
            )}
        </div>
    );
};

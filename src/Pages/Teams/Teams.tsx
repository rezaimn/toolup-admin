import React, {
    Fragment,
    FC,
    useState,
    ComponentPropsWithoutRef,
    useEffect,
} from 'react';
/* components */
import { TeamCard } from 'Components/Molecules/TeamCard';
import SearchInput from 'Components/Atomes/SearchInput/SearchInput';
/* modules */
import cn from 'clsx';
import { TeamHttpResponse, useOrganizationTeams } from 'Hooks/api';
/* helpers */
/* assets */
/* styles */
import map from 'lodash/map';
import { pipe, filter, includes, lowerCase } from 'lodash/fp';
import { routeTo } from 'Helpers/routeTo';
import { NavLink } from 'react-router-dom';
import { Spinner } from '../../Components/Atomes/Spinner';
import styles from './styles.module.scss';
import { addTeam } from '../../assets/icons';
import { PopupTemplate } from '../../Components/Templates/PopupTemplate';
import { TeamMembers } from '../../Components/Organisms/TeamMembers';
/* types */

export type CommonTeamsProps = {};
export type TeamsProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonTeamsProps
> &
    CommonTeamsProps;

const Teams: FC<TeamsProps> = ({ className }) => {
    const [searchInputValue, setSearchInputValue] = useState('');
    const {
        data: teamData = [],
        isLoading: teamsIsLoading,
    } = useOrganizationTeams();

    const search = (tools: TeamHttpResponse[]) => {
        return filter<TeamHttpResponse>(item =>
            includes(lowerCase(searchInputValue as string))(
                lowerCase(item.name)
            )
        )(tools);
    };

    const teams = pipe(search)(teamData);

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.searchWrapper}>
                    <SearchInput
                        className='w-full'
                        onKeyPress={() => {}}
                        setValue={setSearchInputValue}
                        value={searchInputValue || ''}
                    />
                </div>
            </div>
            {teamsIsLoading ? (
                <Spinner className={styles.Spinner} />
            ) : (
                RenderTeams(teams)
            )}
        </div>
    );
};

const RenderTeams = (teams: TeamHttpResponse[]): JSX.Element => {
    return (
        <div
            className={styles.itemWrapper}
            style={{ height: 'calc(100vh - 235px)' }}
        >
            <NavLink to={routeTo('addTeam')} className={styles.addButton}>
                <img className='w-114 h-101' src={addTeam} />
            </NavLink>
            {map(teams, (item, index) => {
                return (
                    <>
                        <NavLink
                            to={routeTo('teamDetail', { teamId: item.id })}
                            className={styles.addButton}
                            data-cy={item.name}
                        >
                            <TeamCard
                                name={item.name}
                                index={index}
                                id={item.id}
                                membersCount={item.members_count}
                                tools={item.tools}
                                color={item.color}
                            />
                        </NavLink>
                    </>
                );
            })}
        </div>
    );
};

export default Teams;

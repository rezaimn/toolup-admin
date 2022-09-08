/* components */
import { SelectableMemberCardList } from 'Components/Organisms/SelectableMemberCardList';
import { NoResultsFound } from 'Components/Organisms/AddMembersToTeams/NoResultsFound';
/* modules */
import { and, isZero, or } from 'Helpers/fp';
import { isEmptyString } from 'Helpers/isEmptyString';
import { Member } from 'Hooks/api';
import { filter, get, includes, lowerCase, negate, pipe } from 'lodash/fp';
/* styles */
import styles from './styles.module.scss';
import { SelectedMembersWithTeamId } from './AddMembersToTeams';

type Props = {
    searchQuery: string;
    all: Member[];
    selectedMembers: SelectedMembersWithTeamId[];
    visible: boolean;
    onSelectMembers: (members: SelectedMembersWithTeamId[]) => void;
    onButtonClick: () => void;
};

export const RenderSearchResult = ({
    searchQuery,
    all,
    onSelectMembers,
    selectedMembers,
    onButtonClick,
    visible,
}: Props): JSX.Element => {
    /*
     *
     */
    const members = filterByName(searchQuery)(all);
    const isSearching = pipe(negate(isEmptyString))(searchQuery);
    const nothingFound = pipe(get('length'), isZero)(members);

    const noResultsFound = and(
        () => isSearching,
        () => nothingFound
    );

    if (
        and(
            () => isSearching,
            () => visible
        )
    ) {
        if (noResultsFound) {
            return (
                <NoResultsFound
                    onClick={onButtonClick}
                    message='No results found'
                    addNewMessage='Add a new member by clicking on'
                    buttonText='ADD NEW MEMBER'
                />
            );
        }
        return (
            <div>
                <p className={styles.title}>Result</p>
                <SelectableMemberCardList
                    onSelect={onSelectMembers}
                    members={members}
                    selectedMembers={selectedMembers}
                />
            </div>
        );
    }
    return <div />;
};

const filterByName = (searchQuery: string) =>
    filter<Member>(m =>
        or(
            () => includes(lowerCase(searchQuery))(lowerCase(m.first_name)),
            () => includes(lowerCase(searchQuery))(lowerCase(m.last_name))
        )
    );

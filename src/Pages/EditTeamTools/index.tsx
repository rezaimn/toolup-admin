import { loadable } from 'Helpers/loadable';

export default loadable(() => import('./EditTeamTools'), {
    fallback: null,
});

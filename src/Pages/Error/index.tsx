import { loadable } from 'Helpers/loadable';

export default loadable(() => import('./Error'), {
    fallback: null,
});

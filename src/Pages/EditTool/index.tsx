import { loadable } from 'Helpers/loadable';

export default loadable(() => import('./EditTool'), {
    fallback: null,
});

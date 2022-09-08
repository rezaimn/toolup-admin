import { loadable } from 'Helpers/loadable';

export default loadable(() => import('./ToolManagement'), {
    fallback: null,
});

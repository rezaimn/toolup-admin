import React from 'react';
import { loadable } from 'Helpers/loadable';

export default loadable(() => import('./AddTool'), {
    fallback: null,
});

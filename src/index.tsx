import React from 'react';
import ReactDOM from 'react-dom';
/* services */
import { ReactQueryService } from 'Services/ReactQueryService';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { initializeGoogleTagManager } from 'Services/GoogleTagManager';
import { initializeErrorTracker } from 'Services/ErrorTracker';
import { ErrorBoundary } from 'Components/Atomes/ErrorBoundary';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './index.css';
import './assets/styles/global.scss';
import 'assets/styles/ant-design/antd.less';
import '@icon-park/react/styles/index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './Store/rootStore';

/* initializing services */
initializeGoogleTagManager();
initializeErrorTracker();

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <ReactQueryService>
                    <Provider store={store}>
                        <DndProvider backend={HTML5Backend}>
                            <App />
                        </DndProvider>
                    </Provider>
                </ReactQueryService>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(null);
// registerServiceWorker();

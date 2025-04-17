import React from 'react';
import ReactDOM from 'react-dom/client';
import { captureException, captureMessage } from '@sentry/react';
import App from './App';
import SamlError from './SamlError';
import './sentry';

const contentBaseUrl = process.env.REACT_APP_CONTENT_BASE_URL;
if (contentBaseUrl) {
	localStorage.setItem('base.content.url', contentBaseUrl);
}

// Set up global error handler
window.onerror = (message, source, lineno, colno, error) => {
	if (error) {
		captureException(error);
	} else {
		captureMessage(`${message} at ${source}:${lineno}:${colno}`);
	}
};

// Set up unhandled promise rejection handler
window.onunhandledrejection = (event) => {
	captureException(event.reason);
};

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const routerSwitch = (page: string) => {
	switch (page) {
		case '/login/saml-error':
			return <SamlError />;
		default:
			return <App />;
	}
};

root.render(
	<React.StrictMode>{routerSwitch(window.location.pathname)}</React.StrictMode>
);

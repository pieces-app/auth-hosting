import { init } from '@sentry/react';

init({
	dsn: 'https://09b649f2c8b544629c1846efcfaf05e7@o552351.ingest.us.sentry.io/6396552',
	integrations: [],
	// Performance Monitoring
	tracesSampleRate: 1.0, // Capture 100% of transactions
	// Session Replay
	replaysSessionSampleRate: 0.1, // Sample rate for session replays
	replaysOnErrorSampleRate: 1.0 // Sample rate for errors
});

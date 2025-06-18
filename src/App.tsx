import { AuthProvider, Descope } from '@descope/react-sdk';
import clsx from 'clsx';
import React, { useEffect, useMemo } from 'react';
import './App.css';
import Done from './components/Done';
import Merge from './components/Merge';
import Confirm from './components/Confirm';
import useOidcMfa from './hooks/useOidcMfa';

// const projectRegex = /^P([a-zA-Z0-9]{27}|[a-zA-Z0-9]{31})$/;
const ssoAppRegex = /^[a-zA-Z0-9\-_]{1,30}$/;

const isFaviconUrlSecure = (url: string, originalFaviconUrl: string) => {
	try {
		const parsedUrl = new URL(url);
		const parsedOriginalUrl = new URL(originalFaviconUrl);
		return (
			parsedUrl.protocol === 'https:' &&
			parsedUrl.hostname === parsedOriginalUrl.hostname
		);
	} catch (error) {
		return false;
	}
};

const getExistingFaviconUrl = async (baseUrl: string, url: string) => {
	return 'https://framerusercontent.com/images/5gIClGDpaFg8xOrCxMKYESchtVk.svg';
	try {
		const response = await fetch(
			`${baseUrl}/api/favicon?url=${encodeURIComponent(url)}`
		);
		if (response.ok) {
			const data = await response.json();
			return data?.faviconUrl || '';
		}
		return '';
	} catch (error) {
		return '';
	}
};

const App = () => {
	let baseUrl = process.env.REACT_APP_DESCOPE_BASE_URL;

	// Force origin base URL
	if (process.env.REACT_APP_USE_ORIGIN_BASE_URL)
		baseUrl = window.location.origin;

	baseUrl = 'https://api.descope.com';
	console.log(window.location.host.indexOf('authentication.pieces.services'));

	console.log(window.location.host.indexOf('authentication.pieces.services'));

	let projectId = '';
	if (window.location.host.indexOf('authentication.pieces.services') !== -1) {
		projectId = 'P2pgKajh2ElmCO6p7ioSPSpS6qev'; // Production
	} else {
		projectId = 'P2v8HgvpS6nKJ8WcrYdOxE71rFDq'; // Testing/Staging
	}

	console.log(`ProjectID: ${projectId}`);

	useOidcMfa();

	const urlParams = useMemo(
		() => new URLSearchParams(window.location.search),
		[]
	);

	const baseFunctionsUrl =
		process.env.REACT_APP_BASE_FUNCTIONS_URL || 'https://api.descope.com/login';

	const faviconUrl =
		'https://framerusercontent.com/images/5gIClGDpaFg8xOrCxMKYESchtVk.svg';

	let ssoAppId = urlParams.get('sso_app_id') || '';
	ssoAppId = ssoAppRegex.exec(ssoAppId)?.[0] || '';

	useEffect(() => {
		const updateFavicon = async () => {
			if (faviconUrl && ssoAppId && projectId) {
				let favicon = faviconUrl;
				// projectId and ssoAppId have been sanitized already
				favicon = favicon.replace('{projectId}', projectId);
				favicon = favicon.replace('{ssoAppId}', ssoAppId);

				if (isFaviconUrlSecure(favicon, faviconUrl)) {
					const existingFaviconUrl = await getExistingFaviconUrl(
						baseFunctionsUrl,
						favicon
					);
					if (existingFaviconUrl) {
						let link = document.querySelector(
							"link[rel~='icon']"
						) as HTMLLinkElement;
						if (!link) {
							link = document.createElement('link');
							link.rel = 'icon';
							document.getElementsByTagName('head')[0].appendChild(link);
						}
						link.href = existingFaviconUrl;
					}
				}
			}
		};

		updateFavicon();
	}, [baseFunctionsUrl, faviconUrl, projectId, ssoAppId]);

	const styleId = urlParams.get('style') || process.env.DESCOPE_STYLE_ID;

	let flowId = '';
	if (window.location.host.indexOf('authentication.pieces.services') !== -1) {
		flowId = 'sign-up-or-in'; // Production
	} else {
		flowId = 'sign-up-or-in'; // Testing/Staging
	}
	console.log(`Flow ID: ${flowId}`);

	const debug =
		urlParams.get('debug') === 'true' ||
		process.env.DESCOPE_FLOW_DEBUG === 'true';

	const done = urlParams.get('done') || false;
	const merge = urlParams.get('merge') || false;
	const confirm = urlParams.get('confirm') || false;

	const locale = urlParams.get('locale') || process.env.DESCOPE_LOCALE;

	const tenantId = urlParams.get('tenant') || process.env.DESCOPE_TENANT_ID;

	const backgroundColor = urlParams.get('bg') || process.env.DESCOPE_BG_COLOR;

	const theme = (urlParams.get('theme') ||
		process.env.DESCOPE_FLOW_THEME) as React.ComponentProps<
		typeof Descope
	>['theme'];

	const isWideContainer =
		urlParams.get('wide') === 'true' ||
		flowId === 'saml-config' ||
		flowId === 'sso-config';

	const shadow = urlParams.get('shadow') !== 'false';

	const containerClasses = clsx({
		'descope-base-container': shadow,
		'descope-wide-container': isWideContainer,
		'descope-login-container': !isWideContainer
	});

	const flowProps = {
		flowId,
		debug,
		locale,
		tenant: tenantId,
		theme,
		styleId,
		...{
			autoFocus: false,
			onSuccess: (out: any) => {
				// console.log(out);
				let search = window?.location.search;
				if (search) {
					search = `${search}&done=true&user_id=${out.detail.user.userId}`;
				} else {
					search = `?done=true&user_id=${out.detail.user.userId}`;
				}

				console.log(out.detail);
				// Make the routes match the updated models in the Flutter
				out.detail.user.oauth = Object.keys(out.detail.user.OAuth);
				out.detail.user.isVerifiedEmail = out.detail.user.verifiedEmail;
				out.detail.user.isVerifiedPhone = out.detail.user.verifiedPhone;
				delete out.detail.user.OAuth;
				delete out.detail.user.verifiedEmail;
				delete out.detail.user.verifiedPhone;

				const newUrl = new URL(window?.location.origin);
				newUrl.pathname = window?.location.pathname;
				newUrl.search = search;
				window?.location.assign(newUrl.toString());
			}
		}
	};

	return (
		<AuthProvider projectId={projectId} baseUrl={baseUrl}>
			<table width="100%">
				<tr>
					<td width="50%" align="right">
						<img
							src="https://storage.googleapis.com/pieces-assets/screen.png"
							alt="Pieces Login Screen"
							width="550"
						/>
					</td>
					<td width="50%">
						<div className="app" style={{ backgroundColor }}>
							{!done && !merge && !confirm && projectId && flowId && (
								<div
									className={containerClasses}
									data-testid="descope-component"
								>
									<Descope {...flowProps} />
								</div>
							)}
							{!done && merge && !confirm && <Merge />}
							{!done && !merge && confirm && <Confirm />}
							{done && <Done />}
						</div>
					</td>
				</tr>
				<tr>
					<td colSpan={2} align="center">
						<a
							href="https://pieces.app/legal/privacy-policy"
							target="_blank"
							rel="noreferrer"
						>
							Privacy Policy
						</a>{' '}
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
						<a
							href="https://pieces.app/legal/terms"
							target="_blank"
							rel="noreferrer"
						>
							Terms &amp; Conditions
						</a>
					</td>
				</tr>
			</table>
		</AuthProvider>
	);
};

export default App;

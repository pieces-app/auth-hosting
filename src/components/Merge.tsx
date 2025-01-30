import '../App.css';
import React, { useMemo } from 'react';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Merge = () => {
	const urlParams = useMemo(
		() => new URLSearchParams(window.location.search),
		[]
	);

	const to = urlParams.get('to') || '';
	const from = urlParams.get('from') || '';

	return (
		<div className="app-content" data-testid="welcome-component">
			<h1 className="welcome-title">Merge Accounts</h1>
			<p className="text-body">
				<b>You are requesting to merge two Pieces.app accounts.</b>
				<br />
				<br />
				You will receive two emails at the below accounts.
				<br />
				Both need emails require a link to be clicked in order to successfully
				merge the accounts.
			</p>
			<p className="example-title">Email #1: {to}</p>
			<p className="example-title">Email #2: {from}</p>
			<p className="example-title">&nbsp;</p>
			<p className="text-body">
				Click the Button below to send the confirmation emails.
			</p>
			<Button size="large" variant="outlined" endIcon={<SendIcon />}>
				Merge Accounts
			</Button>
		</div>
	);
};

export default Merge;

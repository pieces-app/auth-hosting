import '../App.css';
import React, { useMemo, useState } from 'react';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Merge = () => {
	const urlParams = useMemo(
		() => new URLSearchParams(window.location.search),
		[]
	);

	const [disable, setDisabled] = useState(false);

	const to = urlParams.get('to') || '';
	const from = urlParams.get('from') || '';

	const clickHandler = () => {
		fetch(`http://localhost:3001/user/merge`, {
			mode: 'no-cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				to_account: to,
				from_account: from
			})
		})
			.then(() => {
				// console.log(res)
				setDisabled(true);
			})
			.catch(() => {
				// console.log(res)
			});
	};

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
			{!disable && (
				<div>
					<p className="text-body">
						Click the Button below to send the confirmation emails.
					</p>
					<Button
						size="large"
						variant="contained"
						endIcon={<SendIcon />}
						onClick={clickHandler}
						disabled={disable}
					>
						Merge Accounts
					</Button>
				</div>
			)}
			{disable && (
				<p className="example-title">
					Please check you email accounts for the confirmation emails.
				</p>
			)}
		</div>
	);
};

export default Merge;

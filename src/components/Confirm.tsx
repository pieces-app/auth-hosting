import '../App.css';
import React, { useMemo, useState } from 'react';
import { Button } from '@mui/material';

const Confirm = () => {
	const urlParams = useMemo(
		() => new URLSearchParams(window.location.search),
		[]
	);

	const [message, setMessage] = useState(
		'Please click below to confirm your account merger.'
	);
	const [disable, setDisabled] = useState(false);

	const id = urlParams.get('id') || '';
	const direction = urlParams.get('direction') || '';
	const wayId = urlParams.get('way_id') || '';

	const clickHandler = () => {
		fetch(`http://localhost:3001/user/confirm`, {
			mode: 'no-cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				id,
				direction,
				way_id: wayId
			})
		});
		// console.log(res)
		setMessage('You can close this display');
		setDisabled(true);
	};

	return (
		<div className="app-content" data-testid="welcome-component">
			<h1 className="welcome-title">Confirm Merger</h1>
			<p className="text-body">{message}</p>
			<Button
				size="large"
				variant="contained"
				disabled={disable}
				onClick={clickHandler}
			>
				Confirm Merge
			</Button>
		</div>
	);
};

export default Confirm;

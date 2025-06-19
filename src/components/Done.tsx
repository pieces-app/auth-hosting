import '../App.css';
import React from 'react';

const Done = () => (
	<div className="app-content" data-testid="welcome-component">
		<h1 className="welcome-title">Success!</h1>
		<p className="text-body">
			<b>You have successfully logged into Pieces</b>
			<br />
			<br />
		</p>
	</div>
);

export default Done;

import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NoMatch() {
    const navigate = useNavigate();

	return (
		<div>
			<div className="container">
				<div className="error-page">
					<h1 className="error-code">404</h1>
					<p className="error-text">Page not found</p>
                    <Button onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
				</div>
			</div>
		</div>
	);
}
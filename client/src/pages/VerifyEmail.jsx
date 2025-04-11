import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, CircularProgress, Alert } from '@mui/material';

const VerifyEmail = () => {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing.');
                return;
            }

            try {
                const response = await axios.post('/api/auth/verify-email', { token });
                setStatus('success');
                setMessage(response.data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'An error occurred during verification.');
            }
        };

        verifyEmail();
    }, [location]);

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
            {status === 'loading' && <CircularProgress />}
            {status === 'success' && (
                <Alert severity="success" style={{ marginBottom: '20px' }}>
                    {message}
                </Alert>
            )}
            {status === 'error' && (
                <Alert severity="error" style={{ marginBottom: '20px' }}>
                    {message}
                </Alert>
            )}
            {status !== 'loading' && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/login')}
                >
                    Go to Login
                </Button>
            )}
        </Container>
    );
};

export default VerifyEmail;
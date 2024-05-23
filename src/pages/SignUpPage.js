import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Avatar, Container, Grid, Link, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { register } from '../services/userService';
import { UserContext } from '../contexts/UserContext';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(UserContext); // Using login from context to set user

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await register(name, email, password);
            login(user); // Use login from context to set user and save to localStorage
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Name"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Log in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
            </Box>
        </Container>
    );
};

export default SignUpPage;

import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/userService';
import { Box, Typography, Paper, Grid, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const PageContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    maxWidth: '400px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    background: theme.palette.background.default,
}));

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile();
                setUserProfile(profile);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item>
                <PageContainer>
                    <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                        <AccountCircleIcon sx={{ fontSize: 80 }} />
                    </Avatar>
                    <Typography variant="h4" gutterBottom>User Profile</Typography>
                    {userProfile && (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body1">Name: {userProfile.name}</Typography>
                            <Typography variant="body1">Email: {userProfile.email}</Typography>
                            <Typography variant="body1">Membership Status: {userProfile.isMember ? 'Active' : 'Inactive'}</Typography>
                        </Box>
                    )}
                </PageContainer>
            </Grid>
        </Grid>
    );
};

export default UserProfile;

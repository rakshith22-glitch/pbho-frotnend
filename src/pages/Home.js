import React from 'react';
import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom'; // Import your logo image

const HeroSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(4),
    textAlign: 'center',
}));

const FeaturesSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    textAlign: 'center',
    boxShadow: theme.shadows[3],
}));

const CallToActionSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
}));

const Home = () => {
    return (
        <Box>
         
            <HeroSection>
                <Typography variant="h2" gutterBottom >Welcome to Pickleball.Ho!</Typography>
                <Typography variant="h5" gutterBottom >Join the community, play, and improve your game.</Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    component={Link}
                    to="/signup"
                    sx={{ mt: 2 }}
                >
                    Get Started
                </Button>
            </HeroSection>

            <FeaturesSection>
                <Container maxWidth="md">
                    <Typography variant="h4" align="center" gutterBottom >Features</Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <FeatureCard>
                                <Typography variant="h6" gutterBottom >Round Robin Events</Typography>
                                <Typography >Join and participate in round robin events easily.</Typography>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FeatureCard>
                                <Typography variant="h6" gutterBottom >Exclusive Tips & Tricks</Typography>
                                <Typography >Get exclusive pickleball tips and tricks to improve your game.</Typography>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FeatureCard>
                                <Typography variant="h6" gutterBottom >Member Benefits</Typography>
                                <Typography >Enjoy special benefits as a member, including newsletters and more.</Typography>
                            </FeatureCard>
                        </Grid>
                    </Grid>
                </Container>
            </FeaturesSection>

            <CallToActionSection>
                <Typography variant="h5" gutterBottom >Ready to Play?</Typography>
                
            </CallToActionSection>
        </Box>
    );
};

export default Home;

import React, { useContext } from "react";
import { Box, Button, Container, Grid, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import RoundRobinCard from "../components/RoundRobinCard";

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <Box>
      <Container>
        <Typography variant="h2" gutterBottom>
          Welcome to Pickleball.Ho!
        </Typography>
        <Typography variant="h5" gutterBottom>
          Join the community, play, and improve your game.
        </Typography>
        {!user && (
          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/signup"
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              component={Link}
              to="/login"
            >
              Log In
            </Button>
          </Box>
        )}
      </Container>

      <Container mt={4}>
        <Typography variant="h4" gutterBottom>
          Featured Round Robins
        </Typography>
        <Grid container spacing={2}>
          {/* Render Round Robin cards here */}
          <Grid item xs={12} sm={6} md={4}>
            <RoundRobinCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RoundRobinCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RoundRobinCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;

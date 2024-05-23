import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { getRoundRobins } from "../services/roundRobinService"; // Import your service function
import EditIcon from '@mui/icons-material/Edit';

const AdminEditEventsPage = () => {
  const [roundRobins, setRoundRobins] = useState([]);
  const [selectedRoundRobinId, setSelectedRoundRobinId] = useState(null); // State to store the selected RoundRobin ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoundRobins = async () => {
      try {
        const roundRobinsData = await getRoundRobins();
        setRoundRobins(roundRobinsData);
      } catch (error) {
        console.error("Error fetching round robins:", error);
      }
    };

    fetchRoundRobins();
  }, []);

  const handleEdit = (id) => {
    setSelectedRoundRobinId(id);
    navigate(`/edit-round-robin/${id}`);
  };

  const handleCardClick = (id) => {
    // Set the selectedRoundRobinId state when a card is clicked


    // Navigate to the edit page with the specific round robin id
    
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Round Robins List
      </Typography>
      <Grid container spacing={3}>
        {roundRobins
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((roundRobin) => (
            <Grid item xs={12} sm={6} md={4} key={roundRobin._id}>
              <Card
                variant="outlined"
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedRoundRobinId === roundRobin._id
                      ? "#f0f0f0"
                      : "inherit",
                }}
                onClick={() => handleCardClick(roundRobin._id)}
              >
                <CardContent sx={{ paddingTop: 3, paddingBottom: 2 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {roundRobin.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Date: {new Date(roundRobin.date).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Time: {roundRobin.startTime} - {roundRobin.endTime}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Location: {roundRobin.location}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Description: {roundRobin.gameDescription}
                  </Typography>
                  <Box
                    mt={2}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Button
                      onClick={() => handleEdit(roundRobin._id)}
                      color="primary"
                      variant="contained"
                      startIcon={<EditIcon />}
                      sx={{ ml: 1 }}
                    >
                      Edit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default AdminEditEventsPage;

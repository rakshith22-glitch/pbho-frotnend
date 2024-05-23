import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  CardActions,
  Link,
  Chip
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Icon for time
import EventIcon from '@mui/icons-material/Event'; // Icon for date
import LinkIcon from '@mui/icons-material/Link'; // Icon for link
import { getRoundRobins } from "../services/roundRobinService";

const AdminEditEventsPage = () => {
  const [roundRobins, setRoundRobins] = useState([]);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Upcoming Events
      </Typography>
      <Grid container spacing={2}>
        {roundRobins.sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((roundRobin) => (
            <Grid item xs={12} sm={6} md={4} key={roundRobin._id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {roundRobin.title}
                  </Typography>
                  <Box display="flex" alignItems="center" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                    <EventIcon fontSize="small" sx={{ mr: 1, color: 'purple' }} />
                    <Typography variant="body2" gutterBottom>
                      {formatDate(roundRobin.date)}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'blue' }} />
                    <Typography variant="body2" gutterBottom>
                      {formatDate(roundRobin.startTime)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    ${roundRobin.fee}
                  </Typography>
                  {roundRobin.isFull && <Chip label="FULL" color="error" />}
                  {roundRobin.link && (
                    <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                      <LinkIcon fontSize="small" sx={{ mr: 1, color: 'green' }} />
                      <Link href={roundRobin.link} target="_blank" rel="noopener">
                        Join Event
                      </Link>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" onClick={() => navigate(`/edit-round-robin/${roundRobin._id}`)}>
                    Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminEditEventsPage;

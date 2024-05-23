import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Tab,
  Tabs,
  Paper,
  useTheme,
  IconButton,
  Icon,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote"; // Icon for date
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Icon for time
import InfoIcon from "@mui/icons-material/Info"; // General info icon
import { getRoundRobin } from "../services/roundRobinService";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const RoundRobinDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [roundRobin, setRoundRobin] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roundRobinDetails = await getRoundRobin(id);
        roundRobinDetails.formattedDate = new Date(
          roundRobinDetails.date
        ).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        setRoundRobin(roundRobinDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!roundRobin) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Card variant="outlined" sx={{ mb: 2, bgcolor: "background.default" }}>
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            component="div"
            sx={{
              color: "primary.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoIcon sx={{ mr: 1, verticalAlign: "bottom" }} />{" "}
            {roundRobin.title || "Round Robin"}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <EventNoteIcon sx={{ mr: 1, verticalAlign: "bottom" }} /> Date:{" "}
            {roundRobin.formattedDate}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <AccessTimeIcon sx={{ mr: 1, verticalAlign: "bottom" }} /> Time:{" "}
            {`${roundRobin.startTime} - ${roundRobin.endTime}`}
          </Typography>
        </CardContent>
      </Card>
      <Paper elevation={3} sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          centered
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Description" />
          <Tab label="Details" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1">{roundRobin.gameDescription}</Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1">
            Max Players: {roundRobin.maxPlayers}
          </Typography>
          <Typography variant="body1">
            Total Rounds: {roundRobin.maxRounds}
          </Typography>
        </TabPanel>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/events")}
          sx={{ textTransform: "none" }}
        >
          Back to Events
        </Button>
      </Box>
    </Container>
  );
};

export default RoundRobinDetailsPage;

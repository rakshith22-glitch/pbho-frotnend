import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Slider,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  getRoundRobin,
  updateRoundRobin,
  deleteRoundRobin,
} from "../services/roundRobinService";
import { styled } from "@mui/system";

const formats = [
  {
    title: "Regular Play",
    description:
      "Standard Match Play - Just show up and have fun. There is no score keeping for this game format.",
    format: "regular",
  },
  {
    title: "Round Robin: Set Partners",
    description:
      "Play with the same partner for every round. You score as a team. You can have a minimum of 4 and maximum of 16 teams.",
    format: "set-partners",
  },
  {
    title: "Round Robin: Rotating Partners",
    description:
      "Play with a different partner each round. You score as an individual. You can have a minimum of 4 and maximum of 20 Individual players join.",
    format: "rotating-partners",
  },
  {
    title: "Team Pickleball",
    description: "Sign up as a team of 4 and compete against other teams.",
    format: "team",
  },
];

const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 4),
  maxWidth: "600px",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  marginTop: "50px",
  marginBottom: "50px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const EditRoundRobinPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roundRobin, setRoundRobin] = useState({
    title: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    isPublic: true,
    gameDescription: "",
    maxPlayers: 10,
    maxRounds: 2,
    scoringOptions: "1 Match",
    isRotatingPartners: false,
    isRecurring: false,
    minRating: "",
    maxRating: "",
    submitScoresToDUPR: false,
    cost: "",
    link: "",
    gameFormat: "regular",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoundRobinDetails = async () => {
      try {
        const roundRobinDetails = await getRoundRobin(id);
        roundRobinDetails.date = new Date(roundRobinDetails.date)
          .toISOString()
          .split("T")[0];
        setRoundRobin(roundRobinDetails);
      } catch (error) {
        console.error("Error fetching round robin details:", error);
        setError("Failed to load round robin details.");
      }
    };

    fetchRoundRobinDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateRoundRobin(id, roundRobin);
      navigate("/events"); // Adjust as needed to match your routing
    } catch (error) {
      console.error("Error updating round robin:", error);
      setError("Failed to update the event. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRoundRobin(id);
      navigate("/events"); // Redirect appropriately after deletion
    } catch (error) {
      console.error("Error deleting round robin:", error);
      setError("Failed to delete the event. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoundRobin({
      ...roundRobin,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSliderChange = (name) => (e, value) => {
    setRoundRobin({ ...roundRobin, [name]: value });
  };

  return (
    <FormContainer>
      <Typography variant="h5">Edit Round Robin</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
         
          <FormControl fullWidth>
            <InputLabel required id="game-format-label">Game Format</InputLabel>
            <Select
              labelId="game-format-label"
              id="game-format"
              name="gameFormat"
              value={roundRobin.gameFormat}
              onChange={handleChange}
              label="Game Format"
            >
              {formats.map((format) => (
                <MenuItem key={format.format} value={format.format}>
                  {format.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TextField
          label="Event Title"
          fullWidth
          margin="normal"
          name="title"
          value={roundRobin.title || ""}
          onChange={handleChange}
        />
        <TextField
          label="Location"
          fullWidth
          margin="normal"
          name="location"
          value={roundRobin.location || ""}
          onChange={handleChange}
        />
        <TextField
          style={{ marginTop: "10px" }}
          type="date"
          label="Date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          name="date"
          value={roundRobin.date}
          onChange={handleChange}
        />
        <Grid style={{ marginTop: "10px" }} container spacing={2}>
          <Grid item xs={6}>
            <TextField
              type="time"
              label="Start Time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              name="startTime"
              value={roundRobin.startTime}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="time"
              label="End Time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              name="endTime"
              value={roundRobin.endTime}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <RadioGroup
          row
          name="isPublic"
          value={roundRobin.isPublic ? "public" : "private"}
          onChange={handleChange}
        >
          <FormControlLabel value="public" control={<Radio />} label="Public" />
          <FormControlLabel
            value="private"
            control={<Radio />}
            label="Private"
          />
        </RadioGroup>
        <TextField
          label="Game Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          name="gameDescription"
          value={roundRobin.gameDescription}
          onChange={handleChange}
        />
        <TextField
          label="Cost"
          fullWidth
          margin="normal"
          type="number"
          name="cost"
          value={roundRobin.cost}
          onChange={handleChange}
        />
        <TextField
          label="Link for Joining"
          fullWidth
          margin="normal"
          name="link"
          value={roundRobin.link}
          onChange={handleChange}
        />
        <Box mb={2}>
          <Typography variant="body2">Max # of Players</Typography>
          <Slider
            min={4}
            max={28}
            value={roundRobin.maxPlayers}
            onChange={(e, value) => handleSliderChange("maxPlayers")(e, value)}
            valueLabelDisplay="auto"
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Max # of Rounds</Typography>
          <Slider
            min={2}
            max={10}
            value={roundRobin.maxRounds}
            onChange={(e, value) => handleSliderChange("maxRounds")(e, value)}
            valueLabelDisplay="auto"
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Scoring Options</Typography>
          <RadioGroup
            row
            name="scoringOptions"
            value={roundRobin.scoringOptions}
            onChange={handleChange}
          >
            <FormControlLabel
              value="1 Match"
              control={<Radio />}
              label="1 Match"
            />
            <FormControlLabel
              value="Best 2/3"
              control={<Radio />}
              label="Best 2/3"
            />
          </RadioGroup>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">
            Is this a Rotating Partners Round Robin?
          </Typography>
          <Switch
            checked={roundRobin.isRotatingPartners}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "isRotatingPartners",
                  checked: e.target.checked,
                },
              })
            }
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Is this event recurring?</Typography>
          <Switch
            checked={roundRobin.isRecurring}
            onChange={(e) =>
              handleChange({
                target: { name: "isRecurring", checked: e.target.checked },
              })
            }
          />
        </Box>

        <Box mt={2} display="flex" justifyContent="space-between" width="100%">
          <Button type="submit" variant="contained" color="primary">
            Update Event
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete Event
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
};

export default EditRoundRobinPage;

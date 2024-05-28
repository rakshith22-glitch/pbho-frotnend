import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { createRoundRobin } from "../services/roundRobinService";

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

const CreateRoundRobinPage = () => {
  const [formData, setFormData] = useState({
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
  const { format } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (format) {
      setFormData({
        ...formData,
        isRotatingPartners: format === "rotating-partners",
        gameFormat: format,
      });
    }
  }, [format]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRoundRobin(formData);
      navigate("/events"); // Adjust as needed to match your routing
    } catch (error) {
      console.error("Error creating round robin:", error);
      alert("Failed to create the event. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" || type === "switch" ? checked : value,
    });
  };

  const handleSliderChange = (name) => (e, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <FormContainer>
      <Typography variant="h5" align="center" mb={4}>
        Create a Round Robin Event
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel required id="game-format-label">Game Format</InputLabel>
            <Select
              labelId="game-format-label"
              id="game-format"
              name="gameFormat"
              value={formData.gameFormat}
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
          required
          fullWidth
          margin="normal"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          label="Location"
          fullWidth
          required
          margin="normal"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        <TextField
          style={{ marginTop: "10px" }}
          type="date"
          label="Date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <Grid container style={{ marginTop: "10px" }} spacing={2}>
          <Grid item xs={6}>
            <TextField
              type="time"
              label="Start Time"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="time"
              label="End Time"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <RadioGroup
          row
          name="isPublic"
          value={formData.isPublic ? "public" : "private"}
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
          required
          rows={4}
          margin="normal"
          name="gameDescription"
          value={formData.gameDescription}
          onChange={handleChange}
        />
        <TextField
          label="Cost"
          fullWidth
          required
          margin="normal"
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
        />
        <TextField
          label="Link for Joining"
          fullWidth
          margin="normal"
          name="link"
          value={formData.link}
          onChange={handleChange}
        />
        <Box mb={2}>
          <Typography variant="body2">Max # of Players *</Typography>
          <Slider
            min={4}
            max={28}
            value={formData.maxPlayers}
            onChange={handleSliderChange("maxPlayers")}
            valueLabelDisplay="auto"
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Max # of Rounds *</Typography>
          <Slider
            min={2}
            max={10}
            value={formData.maxRounds}
            onChange={handleSliderChange("maxRounds")}
            valueLabelDisplay="auto"
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Scoring Options</Typography>
          <RadioGroup
            row
            name="scoringOptions"
            value={formData.scoringOptions}
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
            name="isRotatingPartners"
            checked={formData.isRotatingPartners}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Is this event recurring?</Typography>
          <Switch
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Create Event
        </Button>
      </form>
    </FormContainer>
  );
};

export default CreateRoundRobinPage;

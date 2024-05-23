import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Divider,
    Link,
    Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createRoundRobin } from '../services/roundRobinService';
import { styled } from '@mui/system';

const FormContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(8, 4),
    maxWidth: '600px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4]
}));

const CourtContainer = styled(Grid)({
    display: 'flex',
    alignItems: 'center'
});

const CreateRoundRobinPage = () => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [gameDescription, setGameDescription] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(10);
    const [maxRounds, setMaxRounds] = useState(2);
    const [scoringOptions, setScoringOptions] = useState('1 Match');
    const [isRotatingPartners, setIsRotatingPartners] = useState(true);
    const [requireDUPR, setRequireDUPR] = useState(false);
    const [minRating, setMinRating] = useState('');
    const [maxRating, setMaxRating] = useState('');
    const [submitScoresToDUPR, setSubmitScoresToDUPR] = useState(false);
    const [clubID, setClubID] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [error, setError] = useState('');
    const [link, setLink] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Event title is required.');
            return;
        }

        const eventsToCreate = [];
        if (isRecurring) {
            for (let i = 0; i < 10; i++) {
                const eventDate = new Date(date);
                eventDate.setDate(eventDate.getDate() + (i * 7));
                eventsToCreate.push(buildEventObject(eventDate.toISOString().slice(0, 10)));
            }
        } else {
            eventsToCreate.push(buildEventObject(date));
        }

        try {
            for (const event of eventsToCreate) {
                await createRoundRobin(event);
            }
            navigate('/');
        } catch (error) {
            console.error('Round Robin creation failed:', error);
            setError('Failed to create the event. Please try again.');
        }
    };

    const buildEventObject = (eventDate) => ({
        title,
        location,
        date: eventDate,
        startTime,
        endTime,
        isPublic,
        gameDescription,
        maxPlayers,
        maxRounds,
        scoringOptions,
        isRotatingPartners,
        isRecurring,
        requireDUPR,
        minRating,
        maxRating,
        submitScoresToDUPR,
        clubID,
    });

    return (
        <FormContainer>
            <Typography variant="h5" align="center" mb={2}>
                Create a Round Robin Event
            </Typography>
            {error && <Alert severity="error" style={{ width: '100%', marginBottom: 16 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    required
                    label="Event Title"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    required
                    label="Location"
                    fullWidth
                    margin="normal"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={4}>
                        <TextField
                            required
                            type="date"
                            label="Date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            type="time"
                            label="Start Time"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            required
                            type="time"
                            label="End Time"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Box mb={2}>
                    <Typography variant="body2">Is this game public or private?</Typography>
                    <RadioGroup row value={isPublic ? 'public' : 'private'} onChange={(e) => setIsPublic(e.target.value === 'public')}>
                        <FormControlLabel value="public" control={<Radio />} label="Public" />
                        <FormControlLabel value="private" control={<Radio />} label="Private" />
                    </RadioGroup>
                </Box>
                <TextField
                    required
                    label="Game Description"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    value={gameDescription}
                    onChange={(e) => setGameDescription(e.target.value)}
                />
                <Box mb={2}>
                    <Typography variant="body2">Max # Players: {maxPlayers}</Typography>
                    <Slider
                        min={4}
                        max={28}
                        value={maxPlayers}
                        valueLabelDisplay="auto"
                        onChange={(e, value) => setMaxPlayers(value)}
                    />
                </Box>
                <Box mb={2}>
                    <Typography variant="body2">Max # Rounds: {maxRounds}</Typography>
                    <Slider
                        min={2}
                        max={10}
                        value={maxRounds}
                        valueLabelDisplay="auto"
                        onChange={(e, value) => setMaxRounds(value)}
                    />
                </Box>
                <Box mb={2}>
                    <Typography variant="body2">Scoring Options</Typography>
                    <RadioGroup row value={scoringOptions} onChange={(e) => setScoringOptions(e.target.value)}>
                        <FormControlLabel value="1 Match" control={<Radio />} label="1 Match" />
                        <FormControlLabel value="Best 2/3" control={<Radio />} label="Best 2/3" />
                    </RadioGroup>
                </Box>
                <Box mb={2}>
                    <Typography variant="body2">Is this a Rotating Partners Round Robin?</Typography>
                    <Switch
                        checked={isRotatingPartners}
                        onChange={(e) => setIsRotatingPartners(e.target.checked)}
                    />
                </Box>
                <Box mb={2}> 
                    <Typography variant="body2">Is this a recurring event?</Typography>
                    <Switch
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                </Box>
                <TextField
                    fullWidth
                    label="Add a link"
                    variant="outlined"
                    margin="normal"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                {link && (
                    <Box mt={2}>
                        <iframe
                            title="Embedded Content"
                            width="100%"
                            height="400px"
                            src={link}
                            frameBorder="0"
                            allowFullScreen
                        />
                    </Box>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Create Event
                </Button>
            </form>
        </FormContainer>
    );
};

export default CreateRoundRobinPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoundRobin, updateRoundRobin, deleteRoundRobin } from '../services/roundRobinService';
import { Typography, Box, TextField, Button, RadioGroup, FormControlLabel, Radio, Switch, Slider, Grid } from '@mui/material';
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

const EditRoundRobinPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [roundRobin, setRoundRobin] = useState(null);

    useEffect(() => {
        const fetchRoundRobinDetails = async () => {
            try {
                const roundRobinDetails = await getRoundRobin(id);

                // Format the date to YYYY-MM-DD
                roundRobinDetails.date = new Date(roundRobinDetails.date).toISOString().split('T')[0];

                setRoundRobin(roundRobinDetails);
            } catch (error) {
                console.error('Error fetching round robin details:', error);
                // Handle error (e.g., display error message)
            }
        };

        fetchRoundRobinDetails();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateRoundRobin(id, roundRobin);
            navigate('/'); // Redirect to round-robin list page after successful update
        } catch (error) {
            console.error('Error updating round robin:', error);
            // Handle error (e.g., display error message)
        }
    };

    const handleDelete = async () => {
        try {
            await deleteRoundRobin(id);
            alert('Round Robin deleted successfully');
            navigate('/'); // Redirect to round-robin list page after successful deletion
        } catch (error) {
            console.error('Error deleting round robin:', error);
            // Handle error (e.g., display error message)
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoundRobin({ ...roundRobin, [name]: value });
    };

    const handleSliderChange = (name) => (e, value) => {
        setRoundRobin({ ...roundRobin, [name]: value });
    };

    const handleSwitchChange = (name) => (e) => {
        setRoundRobin({ ...roundRobin, [name]: e.target.checked });
    };

    if (!roundRobin) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <FormContainer>
            <Typography variant="h5">Edit Round Robin</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Event Title"
                    fullWidth
                    margin="normal"
                    name="title"
                    value={roundRobin.title}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Location"
                    fullWidth
                    margin="normal"
                    name="location"
                    value={roundRobin.location}
                    onChange={handleInputChange}
                />
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={4}>
                        <TextField
                            type="date"
                            label="Date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            name="date"
                            value={roundRobin.date}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            type="time"
                            label="Start Time"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            name="startTime"
                            value={roundRobin.startTime}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            type="time"
                            label="End Time"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            name="endTime"
                            value={roundRobin.endTime}
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>
                <RadioGroup row name="isPublic" value={roundRobin.isPublic ? 'public' : 'private'} onChange={handleInputChange}>
                    <FormControlLabel value="public" control={<Radio />} label="Public" />
                    <FormControlLabel value="private" control={<Radio />} label="Private" />
                </RadioGroup>
                <TextField
                    label="Game Description"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    name="gameDescription"
                    value={roundRobin.gameDescription}
                    onChange={handleInputChange}
                />
                <Box mb={2}>
                    <Typography variant="body2">Max # Players: {roundRobin.maxPlayers}</Typography>
                    <Slider
                        min={4}
                        max={28}
                        value={roundRobin.maxPlayers}
                        valueLabelDisplay="auto"
                        onChange={handleSliderChange('maxPlayers')}
                    />
                </Box>
                <Box mb={2}>
                    <Typography variant="body2">Max # Rounds: {roundRobin.maxRounds}</Typography>
                    <Slider
                        min={2}
                        max={10}
                        value={roundRobin.maxRounds}
                        valueLabelDisplay="auto"
                        onChange={handleSliderChange('maxRounds')}
                    />
                </Box>
                <RadioGroup row name="scoringOptions" value={roundRobin.scoringOptions} onChange={handleInputChange}>
                    <FormControlLabel value="1 Match" control={<Radio />} label="1 Match" />
                    <FormControlLabel value="Best 2/3" control={<Radio />} label="Best 2/3" />
                </RadioGroup>
                <FormControlLabel
                    control={<Switch checked={roundRobin.isRotatingPartners} onChange={handleSwitchChange('isRotatingPartners')} />}
                    label="Is this a Rotating Partners Round Robin?"
                />
                <FormControlLabel
                    control={<Switch checked={roundRobin.isRecurring} onChange={handleSwitchChange('isRecurring')} />}
                    label="Is this a Recurring Event?"
                />
                <TextField
                    label="Edit/Add link to join Round-Robin"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    name="link"
                    value={roundRobin.link}
                    onChange={handleInputChange}
                />
                {roundRobin.link && (
                    <Box mt={2}>
                        <iframe
                            title="Embedded Content"
                            width="100%"
                            height="400px"
                            src={roundRobin.link}
                            frameBorder="0"
                            allowFullScreen
                        />
                    </Box>
                )}
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

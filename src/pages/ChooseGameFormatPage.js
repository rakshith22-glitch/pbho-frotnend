import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Grid,
    Card,
    CardActionArea,
    CardContent
} from '@mui/material';
import { styled } from '@mui/system';

const formats = [
    { title: 'Regular Play', description: 'Standard Match Play - Just show up and have fun. There is no score keeping for this game format.', format: 'regular' },
    { title: 'Round Robin: Set Partners', description: 'Play with the same partner for every round. You score as a team. You can have a minimum of 4 and maximum of 16 teams.', format: 'set-partners' },
    { title: 'Round Robin: Rotating Partners', description: 'Play with a different partner each round. You score as an individual. You can have a minimum of 4 and maximum of 20 Individual players join.', format: 'rotating-partners' },
    { title: 'Team Pickleball', description: 'Sign up as a team of 4 and compete against other teams.', format: 'team' }
];

const CardContainer = styled(Card)(({ theme }) => ({
    margin: theme.spacing(2),
    boxShadow: theme.shadows[3]
}));

const ChooseGameFormatPage = () => {
    const navigate = useNavigate();

    const handleCardClick = (format) => {
        navigate(`/create-round-robin/${format}`);
    };

    return (
        <Box p={4} maxWidth="800px" m="auto">
            <Typography variant="h4" align="center" mb={4}>
                Choose Your Game Format
            </Typography>
            <Grid container spacing={2}>
                {formats.map((item) => (
                    <Grid item xs={12} md={6} key={item.format}>
                        <CardContainer>
                            <CardActionArea onClick={() => handleCardClick(item.format)}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </CardContainer>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ChooseGameFormatPage;

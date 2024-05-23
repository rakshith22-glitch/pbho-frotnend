import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, Container, Link } from '@mui/material';
import { getRoundRobin } from '../services/roundRobinService';

const RoundRobinDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [roundRobin, setRoundRobin] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {

                const roundRobinDetails = await getRoundRobin(id);
               

                // Format the date to YYYY-MM-DD
                roundRobinDetails.date = new Date(roundRobinDetails.date).toISOString().split('T')[0];

                setRoundRobin(roundRobinDetails);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);


    if (!roundRobin) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>{roundRobin.title}</Typography>
                    <Typography variant="body1" align="center" gutterBottom>Date: {roundRobin.date}</Typography>
                   
                    <Typography variant="body1" align="center" gutterBottom>Start Time: {roundRobin.startTime}</Typography>
                    <Typography variant="body1" align="center" gutterBottom>End Time: {roundRobin.endTime}</Typography>
                    <Typography variant="body1" align="center" gutterBottom>Description: {roundRobin.gameDescription}</Typography>
                    {roundRobin.link && (
                        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                            Click on the link to join the round robin: 
                            <Link href={roundRobin.link} target="_blank" rel="noopener" sx={{ ml: 1 }}>
                                {roundRobin.link}
                            </Link>
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                            Back to Home
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RoundRobinDetailsPage;

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { getRoundRobins, signUpForRoundRobin } from '../services/roundRobinService';
import { getUserProfile } from '../services/userService';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const RoundRobinList = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [roundRobins, setRoundRobins] = useState([]);
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [colorMap, setColorMap] = useState({});

    useEffect(() => {
        const fetchRoundRobins = async () => {
            const roundRobinData = await getRoundRobins();
            setRoundRobins(roundRobinData);
            generateEvents(roundRobinData);
        };

        const fetchUserProfile = async () => {
            const userProfile = await getUserProfile();
            setUser(userProfile);
        };

        fetchRoundRobins();
        fetchUserProfile();
    }, []);

    const generateEvents = (roundRobins) => {
        const calendarEvents = roundRobins.flatMap((roundRobin) => {
            const eventList = [];
            const startDate = new Date(roundRobin.date);
            const endDate = new Date(roundRobin.date);

            endDate.setHours(roundRobin.endTime.split(':')[0], roundRobin.endTime.split(':')[1]);

            if (roundRobin.isRecurring) {
                for (let i = 0; i < 52; i++) {
                    const newEventDate = new Date(startDate);
                    newEventDate.setDate(startDate.getDate() + i * 7);
                    eventList.push({
                        id: roundRobin._id,
                        title: roundRobin.title || 'Round Robin',
                        start: new Date(newEventDate.setHours(roundRobin.startTime.split(':')[0], roundRobin.startTime.split(':')[1])),
                        end: new Date(newEventDate.setHours(roundRobin.endTime.split(':')[0], roundRobin.endTime.split(':')[1])),
                        allDay: false
                    });
                }
            } else {
                eventList.push({
                    id: roundRobin._id,
                    title: roundRobin.title || 'Round Robin',
                    start: new Date(startDate.setHours(roundRobin.startTime.split(':')[0], roundRobin.startTime.split(':')[1])),
                    end: new Date(endDate),
                    allDay: false
                });
            }
            return eventList;
        });
        setEvents(calendarEvents);
    };

    const handleSelectEvent = (event) => {
        const eventId = event.id;
        navigate(`/round-robin/${eventId}`);
    };

    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getColorForEvent = (title) => {
        if (!colorMap[title]) {
            const newColor = generateRandomColor();
            setColorMap((prevColorMap) => ({
                ...prevColorMap,
                [title]: newColor
            }));
            return newColor;
        }
        return colorMap[title];
    };

    const eventPropGetter = (event) => {
        const backgroundColor = getColorForEvent(event.title);
        return { style: { backgroundColor } };
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box
                    p={isMobile ? 2 : 4}
                    boxShadow={2}
                    borderRadius={2}
                    sx={{ overflowX: 'auto' }}
                >
                    <Typography
                        variant="h6"
                        align="center"
                        mb={isMobile ? 1 : 2}
                    >
                        Event Calendar
                    </Typography>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{
                            height: isMobile ? 'calc(80vh - 96px)' : 'calc(100vh - 96px)',
                            minHeight: 500,
                            fontSize: isMobile ? '12px' : 'inherit'
                        }}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventPropGetter}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default RoundRobinList;

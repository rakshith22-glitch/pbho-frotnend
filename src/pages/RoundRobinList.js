import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    useMediaQuery,
    useTheme,
    Tooltip
} from '@mui/material';
import { getRoundRobins } from '../services/roundRobinService';
import { getUserProfile } from '../services/userService';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const character = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const RoundRobinList = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [events, setEvents] = useState([]);
    const [colorMap, setColorMap] = useState({});
    const fixedColors = ['#009688', '#FFD700', '#ADD8E6', '#90EE90', '#FFB6C1']; // Array of light colors

    useEffect(() => {
        const fetchData = async () => {
            const roundRobinData = await getRoundRobins();
            const userProfile = await getUserProfile();
            generateEvents(roundRobinData);
        };
        fetchData();
    }, []);

    const generateEvents = (roundRobins) => {
        const calendarEvents = roundRobins.map((roundRobin) => {
            const startDate = new Date(roundRobin.date);
            const endDate = new Date(roundRobin.date);
            endDate.setHours(roundRobin.endTime.split(':')[0], roundRobin.endTime.split(':')[1]);
            startDate.setHours(roundRobin.startTime.split(':')[0], roundRobin.startTime.split(':')[1]);

            return {
                id: roundRobin._id,
                title: roundRobin.title || 'Round Robin',
                start: startDate,
                end: endDate,
                location: roundRobin.location,
                resource: roundRobin
            };
        });
        setEvents(calendarEvents);
    };

    const eventPropGetter = (event) => {
        const backgroundColor = getColorForEvent(event.title);
        return {
            style: { backgroundColor, borderColor: 'black' }
        };
    };

    const getColorForEvent = (title) => {
        if (!colorMap[title]) {
            const colorIndex = hashCode(title) % fixedColors.length;
            const newColor = fixedColors[colorIndex];
            setColorMap((prevColorMap) => ({
                ...prevColorMap,
                [title]: newColor
            }));
            return newColor;
        }
        return colorMap[title];
    };

    const EventAgenda = ({ event }) => {
        return (
            <span>
                <strong>{event.title}</strong>
                <p>Start: {moment(event.start).format('HH:mm')} </p>
                <p>End: {moment(event.end).format('HH:mm')}</p>
                <p>Location: {event.location}</p>
            </span>
        );
    };

    return (
        <Grid container spacing={2} justifyContent="center" style={{marginTop: "2%", marginBottom: "2%"}}>
            <Grid item xs={12} md={10} style={{ maxWidth: '90%' }}>
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
                            height: isMobile ? 'calc(100vh - 96px)' : '140vh',
                            minHeight: 500,
                            fontSize: isMobile ? '12px' : 'inherit'
                        }}
                        components={{ event: EventAgenda }}
                        onSelectEvent={(event) => navigate(`/round-robin/${event.id}`)}
                        eventPropGetter={eventPropGetter}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default RoundRobinList;

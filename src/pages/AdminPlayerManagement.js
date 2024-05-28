import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Container, List, ListItem, ListItemText,
  ListItemAvatar, ListItemSecondaryAction, IconButton, Avatar,
  Grid, Card, CardContent, CardActions, TextField, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UserContext } from "../contexts/UserContext";
import {
  getRoundRobin,
  sendJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
  removeUserFromRoundRobin,
  editRoundRobin,
  deleteRoundRobin,
} from "../services/roundRobinService";
import {searchUsers } from "../services/userService";
const RoundRobinDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [roundRobin, setRoundRobin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const data = await getRoundRobin(id);
      setRoundRobin(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleSearch = async () => {
    const results = await searchUsers(searchTerm);
    setSearchResults(results);
  };

  if (loading) return <CircularProgress color="inherit" />;

  if (!roundRobin) return <Typography variant="h6">Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card raised sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {roundRobin.title || "Round Robin"}
            <IconButton onClick={() => editRoundRobin(roundRobin)} sx={{ float: 'right' }}>
              <EditIcon />
            </IconButton>
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Event Details: {roundRobin.details || "No additional details provided."}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={() => deleteRoundRobin(id)}>
            Delete Event
          </Button>
        </CardActions>
      </Card>

      <Card raised sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5">Participants</Typography>
          <List>
            {roundRobin.participants.map((participant) => (
              <ListItem key={participant._id}>
                <ListItemText primary={participant.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeUserFromRoundRobin(id, participant._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card raised sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5">Join Requests</Typography>
          <List>
            {roundRobin.joinRequests.map((request) => (
              <ListItem key={request._id}>
                <ListItemText primary={request.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => approveJoinRequest(id, request._id)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => rejectJoinRequest(id, request._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card raised>
        <CardContent>
          <TextField
            fullWidth
            label="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <List>
            {searchResults.map((user) => (
              <ListItem key={user._id}>
                <ListItemText primary={user.name} secondary={user.email} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => approveJoinRequest(id, user._id)}>
                    <AddIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RoundRobinDetailsPage;

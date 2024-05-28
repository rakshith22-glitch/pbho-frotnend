import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Container, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Grid, Card, CardContent,
  Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, CircularProgress, Autocomplete
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SearchIcon from "@mui/icons-material/Search";
import StartIcon from "@mui/icons-material/Start";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getRoundRobin, joinRoundRobin, addUserToRoundRobin, removeUserFromRoundRobin, deleteRoundRobin, sendJoinRequest
} from "../services/roundRobinService";
import {
  searchUsers
} from "../services/userService";
import { getUserDetails, getAllUsers } from "../services/userService";
import { UserContext } from "../contexts/UserContext";

const RoundRobinDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [roundRobin, setRoundRobin] = useState(null);
  const [playersDetails, setPlayersDetails] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [joinRequests, setJoinRequests] = useState([]); // New state for join requests

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roundRobinDetails = await getRoundRobin(id);
        const users = await getAllUsers();
        setAllUsers(users);
        roundRobinDetails.formattedDate = new Date(roundRobinDetails.date).toLocaleDateString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        });
        setRoundRobin(roundRobinDetails);
        if (user && user.userType === "admin") {
          fetchPlayerDetails(roundRobinDetails.players);
          setJoinRequests(roundRobinDetails.joinRequests || []); // Set join requests if admin
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch round robin details.");
      }
      setLoading(false);
    };

    fetchData();
  }, [id, user]);

  const fetchPlayerDetails = async (playerIds) => {
    try {
      const details = await Promise.all(playerIds.map((playerId) => getUserDetails(playerId)));
      setPlayersDetails(details);
    } catch (error) {
      console.error("Failed to fetch player details:", error);
      alert("Failed to load player details.");
    }
  };

  const handleAddUser = async (userId) => {
    if (roundRobin.players.includes(userId)) {
      alert("User is already a participant.");
      return;
    }
    try {
      await addUserToRoundRobin(id, userId);
      const updatedRoundRobin = await getRoundRobin(id);
      setRoundRobin(updatedRoundRobin);
      fetchPlayerDetails(updatedRoundRobin.players);
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user to the round robin. Please try again.");
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      await removeUserFromRoundRobin(id, userId);
      const updatedRoundRobin = await getRoundRobin(id);
      setRoundRobin(updatedRoundRobin);
      fetchPlayerDetails(updatedRoundRobin.players);
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user from the round robin.");
    }
  };

  const handleJoinOrLeaveEvent = async () => {
    try {
      if (roundRobin.players.includes(user._id)) {
        await removeUserFromRoundRobin(id, user._id);
        alert("You have successfully left the round robin!");
      } else {
        await sendJoinRequest(id, user._id);
        alert("Your request to join the round robin has been sent!");
      }
      const updatedRoundRobin = await getRoundRobin(id);
      setRoundRobin(updatedRoundRobin);
    } catch (error) {
      console.error("Error updating participation:", error);
      alert("Failed to update your participation. Please try again later.");
    }
  };

  const handleSearch = async (event, value) => {
    setSearchTerm(value);
    if (value.length >= 3) {
      try {
        const results = await searchUsers(value);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
        alert("Failed to search users. Please try again.");
      }
    }
  };

  const handleApproveJoinRequest = async (userId) => {
    await handleAddUser(userId);
    setJoinRequests(joinRequests.filter(request => request !== userId));
  };

  const handleRejectJoinRequest = async (userId) => {
    setJoinRequests(joinRequests.filter(request => request !== userId));
    alert("Join request rejected.");
  };

  const handleDeleteRoundRobin = async () => {
    try {
      await deleteRoundRobin(id);
      navigate("/events");
      alert("Round robin deleted successfully.");
    } catch (error) {
      console.error("Error deleting round robin:", error);
      alert("Failed to delete round robin. Please try again.");
    }
  };

  const spotsLeft = roundRobin ? roundRobin.maxPlayers - roundRobin.players.length : 0;
  const isParticipant = roundRobin?.players.includes(user?._id);

  if (loading) return <CircularProgress />;

  if (!roundRobin) return <Typography variant="h6">Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ mb: 2, bgcolor: "background.default" }}>
            <CardContent>
              <Typography variant="h4" gutterBottom component="div" sx={{ color: "primary.main", display: "flex", alignItems: "center" }}>
                <InfoIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
                {roundRobin.title || "Round Robin"}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <EventNoteIcon sx={{ mr: 1, verticalAlign: "bottom" }} /> Date: {roundRobin.formattedDate}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <AccessTimeIcon sx={{ mr: 1, verticalAlign: "bottom" }} /> Time: {`${new Date(`1970-01-01T${roundRobin.startTime}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(`1970-01-01T${roundRobin.endTime}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {user && user.userType === "admin" && (
                  <>
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/edit-round-robin/${id}`)} sx={{ mr: 2 }}>
                      Edit
                    </Button>
                    <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={handleDeleteRoundRobin}>
                      Delete
                    </Button>
                    <Button variant="outlined" startIcon={<StartIcon />} onClick={() => navigate(`/start/${id}`)} sx={{ml: 2, mr: 2 }}>
                      Start
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ width: "100%" }}>
            <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)} centered indicatorColor="primary" textColor="primary">
              <Tab label="Details" />
              {user && user.userType === "admin" && <Tab label="Manage Participants" />}
              {user && user.userType === "admin" && <Tab label="Join Requests" />}
            </Tabs>
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="body1" sx={{ mt: 2, mb: 1, fontWeight: 'bold', bgcolor: '#f0f0f0', p: 1, borderRadius: '4px' }}>
                    Description: {roundRobin.gameDescription}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: 'primary.dark', fontWeight: 'medium', bgcolor: '#e0e0e0', p: 1, borderRadius: '4px' }}>
                    Max Players: {roundRobin.maxPlayers}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: 'secondary.main', fontStyle: 'italic', bgcolor: '#e0f7fa', p: 1, borderRadius: '4px' }}>
                    Total Rounds: {roundRobin.maxRounds}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: 'error.main', fontWeight: 'bold', fontSize: '1.1rem', bgcolor: '#ffebee', p: 1, borderRadius: '4px' }}>
                    {spotsLeft} spots left
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 300 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Participants</TableCell>
                          <TableCell align="right">Details</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {roundRobin.players.length > 0 ? (
                          roundRobin.players.map((player, index) => (
                            <TableRow key={player._id}>
                              <TableCell component="th" scope="row">
                                Player {index + 1}
                              </TableCell>
                              <TableCell align="right">Participant details</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2}>No participants yet.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
              {tabValue === 1 && user && user.userType === "admin" && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Box sx={{ width: "48%" }}>
                    <Typography variant="h6">Search Users</Typography>
                    <Autocomplete
                      freeSolo
                      options={searchResults}
                      getOptionLabel={(option) => option.name || ""}
                      onInputChange={handleSearch}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          label="Search Users"
                          variant="outlined"
                          sx={{ mb: 2 }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <IconButton onClick={() => handleSearch(null, searchTerm)}>
                                <SearchIcon />
                              </IconButton>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option._id}>
                          <ListItemText primary={option.name} secondary={option.email} />
                          <IconButton edge="end" onClick={() => handleAddUser(option._id)}>
                            <PersonAddIcon />
                          </IconButton>
                        </Box>
                      )}
                    />
                  </Box>
                  <Box sx={{ width: "48%" }}>
                    <Typography variant="h6">Participants</Typography>
                    <List>
                      {playersDetails.length > 0 ? (
                        playersDetails.map((player) => (
                          <ListItem key={player._id}>
                            <ListItemText primary={player.name} secondary={player.email} />
                            <ListItemSecondaryAction>
                              <IconButton edge="end" onClick={() => handleRemoveUser(player._id)}>
                                <PersonRemoveIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText primary="No participants yet." />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </Box>
              )}
              {tabValue === 2 && user && user.userType === "admin" && (
                <Box>
                  <Typography variant="h6">Join Requests</Typography>
                  <List>
                    {joinRequests.length > 0 ? (
                      joinRequests.map((requestId) => (
                        <ListItem key={requestId}>
                          <ListItemText primary={requestId} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleApproveJoinRequest(requestId)}>
                              <PersonAddIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleRejectJoinRequest(requestId)}>
                              <PersonRemoveIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No join requests." />
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleJoinOrLeaveEvent}
              disabled={
                !roundRobin.isWaitlistOpen &&
                roundRobin.players.length >= roundRobin.maxPlayers &&
                !isParticipant
              }
              sx={{ textTransform: "none" }}
            >
              {isParticipant ? "Leave Round Robin" : "Join Round Robin"}
            </Button>
            <Button variant="outlined" color="primary" onClick={() => navigate("/events")} sx={{ textTransform: "none" }}>
              Back to Events
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoundRobinDetailsPage;

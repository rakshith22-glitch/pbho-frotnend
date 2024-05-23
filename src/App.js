import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BecomeMemberPage from "./pages/BecomeMemberPage";
import CreateRoundRobinPage from "./pages/CreateRoundRobinPage";
import ChooseGameFormatPage from "./pages/ChooseGameFormatPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import RoundRobinList from "./pages/RoundRobinList";
import RoundRobinDetailsPage from "./pages/RoundRobinDetailsPage";
import AdminEditEvents from "./pages/AdminEditEvents";
import EditRoundRobinPage from "./pages/EditRoundRobinPage";
import UserProfile from "./pages/UserProfile";
import theme from "./theme.js";
import { UserContext, UserProvider } from "./contexts/UserContext";
import Logo from "./assets/logo.png";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        {user ? (
          <>
            {user.userType === "admin" ? (
              <>
                <ListItem button component={Link} to="/choose-game-format">
                  <ListItemText primary="Create Round Robin" />
                </ListItem>
                <ListItem button component={Link} to="/edit">
                  <ListItemText primary="Edit Events" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/become-member">
                  <ListItemText primary="Become Member" />
                </ListItem>
              </>
            )}
            <ListItem button component={Link} to="/events">
              <ListItemText primary="Events" />
            </ListItem>
            <ListItem button component={Link} to="/profile">
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/signup">
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile ? (
          <>
            {" "}
            <Box sx={{ width: "100%", textAlign: "left" }}>
              <img
                src={Logo}
                alt="Pickleball.Ho Logo"
                style={{ height: "50px", margin: 10 }}
              />
            </Box>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawer}
            </Drawer>
            <Box sx={{ flexGrow: 1 }} />
            {user && (
              <IconButton color="inherit" component={Link} to="/profile">
                <AccountCircleIcon />
              </IconButton>
            )}
          </>
        ) : (
          <>
          <Button color="inherit" component={Link} to="/"> 
            <img
              src={Logo}
              alt="Pickleball.Ho Logo"
              style={{ height: "50px", margin: 10 }}
            />
            </Button>
          
            {user ? (
              <>
                {user.userType === "admin" ? (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/choose-game-format"
                    >
                      Create Round Robin
                    </Button>
                    <Button color="inherit" component={Link} to="/edit">
                      Edit Events
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/become-member"
                    >
                      Become Member
                    </Button>
                  </>
                )}
                <Button color="inherit" component={Link} to="/events">
                  Events
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  color="inherit"
                  component={Link}
                  to="/profile"
                  startIcon={<AccountCircleIcon />}
                >
                  Profile
                </Button>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Router>
          <Box>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/become-member" element={<BecomeMemberPage />} />
              <Route
                path="/choose-game-format"
                element={<ChooseGameFormatPage />}
              />
              <Route
                path="/create-round-robin/:format"
                element={<CreateRoundRobinPage />}
              />
              <Route path="/events" element={<RoundRobinList />} />
              <Route
                path="/round-robin/:id"
                element={<RoundRobinDetailsPage />}
              />
              <Route path="/edit" element={<AdminEditEvents />} />
              <Route
                path="/edit-round-robin/:id"
                element={<EditRoundRobinPage />}
              />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Box>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;

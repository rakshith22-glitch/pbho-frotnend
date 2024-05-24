import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#283593', // A deep, muted blue, suitable for a professional look
    },
    secondary: {
      main: '#009688', // A teal shade that pairs well with the primary color
    },
    background: {
      default: '#f4f4f4', // A light grey, less stark than pure white
      paper: '#ffffff', // Keeping paper as white for clear contrast
    },
    text: {
      primary: '#212121', // A dark grey, softer than pure black
      secondary: '#757575' // A medium grey for secondary text
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h4: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
});

export default theme;

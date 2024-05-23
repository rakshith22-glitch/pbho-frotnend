// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#6B8E23',
    },
    background: {
      default: '#FDF5E6',
      paper: '#FFF8DC',
    },
    text: {
      primary: '#333',
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

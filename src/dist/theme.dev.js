"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _styles = require("@mui/material/styles");

// frontend/src/theme.js
var theme = (0, _styles.createTheme)({
  palette: {
    primary: {
      main: '#000000'
    },
    secondary: {
      main: '#6B8E23'
    },
    background: {
      "default": '#FDF5E6',
      paper: '#FFF8DC'
    },
    text: {
      primary: '#333'
    }
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h4: {
      fontWeight: 700
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    }
  }
});
var _default = theme;
exports["default"] = _default;
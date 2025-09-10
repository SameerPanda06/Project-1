import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Customize your theme here

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366', // Navy
    },
    secondary: {
      main: '#0073e6', // Light blue
    },
    accent: {
      main: '#f9a825', // Mustard Yellow (custom accent used in styles)
    },
    background: {
      default: '#f4f7fa', // Soft off-white background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontFamily: '"Roboto Slab", serif',
      fontWeight: 700,
      color: '#003366',
    },
    h5: {
      color: '#f9a825',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          padding: '10px 24px',
          fontWeight: 'bold',
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: '#f9a825',
            color: '#003366',
            boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);

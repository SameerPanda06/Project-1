import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 600,
          p: 5,
          borderRadius: 3,
          textAlign: 'center',
          color: 'white',
          bgcolor: 'rgba(0, 0, 0, 0.6)',
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
          Smart Class Scheduler
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Optimized timetable solutions for your institution
        </Typography>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          size="large"
          sx={{
            bgcolor: '#f50057',
            ':hover': { bgcolor: '#c51162' },
            fontWeight: 'bold',
            px: 5,
          }}
        >
          Get Started
        </Button>
      </Paper>
    </Box>
  );
};

export default LandingPage;

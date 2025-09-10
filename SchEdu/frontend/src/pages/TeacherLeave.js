import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/lab';

const TeacherLeave = () => {
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [daysApplied, setDaysApplied] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!weekStartDate) {
      setError('Please select the start date of the week.');
      return false;
    }
    if (!daysApplied) {
      setError('Please enter number of leave days.');
      return false;
    }
    if (daysApplied < 1 || daysApplied > 2) {
      setError('You can apply for 1 or 2 leave days only.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      const response = await fetch('/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // adjust as needed
        },
        body: JSON.stringify({
          weekStartDate: weekStartDate.toISOString().split('T')[0],
          daysApplied: Number(daysApplied),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to apply for leave.');
      } else {
        setSuccess('Leave applied successfully and automatically approved.');
        setWeekStartDate(null);
        setDaysApplied('');
      }
    } catch {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Apply for Leave
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DatePicker
          label="Week Start Date"
          value={weekStartDate}
          onChange={(newValue) => setWeekStartDate(newValue)}
          renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
        />

        <TextField
          label="Days Applied"
          type="number"
          inputProps={{ min: 1, max: 2 }}
          value={daysApplied}
          onChange={(e) => setDaysApplied(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
          You can apply for up to 2 leave days per week. Leave requests within limits are automatically approved.
        </Typography>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit Leave Application
        </Button>
      </Box>
    </Container>
  );
};

export default TeacherLeave;

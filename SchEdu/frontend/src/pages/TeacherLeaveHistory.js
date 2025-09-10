import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

const TeacherLeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/leave', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Use your auth token source
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to fetch leave history.');
      } else {
        setLeaves(data);
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Leave History
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && leaves.length === 0 && (
        <Typography>No leave records found.</Typography>
      )}

      {!loading && !error && leaves.length > 0 && (
        <Paper sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Week Start Date</TableCell>
                <TableCell>Days Applied</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.weekStartDate}</TableCell>
                  <TableCell>{leave.daysApplied}</TableCell>
                  <TableCell>{leave.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default TeacherLeaveHistory;

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const mockUsers = [
  { username: 'admin', password: 'adminpass', role: 'Admin' },
  { username: 'teacher', password: 'teacherpass', role: 'Teacher' },
  { username: 'student', password: 'studentpass', role: 'Student' },
];

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    setError('');
    if (!username || !password || !role) {
      setError('Please fill all fields');
      return;
    }
    const user = mockUsers.find(
      (u) =>
        u.username === username.trim() &&
        u.password === password &&
        u.role === role
    );
    if (!user) {
      setError('Invalid credentials or role');
      return;
    }
    switch (role) {
      case 'Admin':
        navigate('/admin');
        break;
      case 'Teacher':
        navigate('/teacher');
        break;
      case 'Student':
        navigate('/student');
        break;
      default:
        setError('Invalid role');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;

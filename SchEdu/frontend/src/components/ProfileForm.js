import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ProfileForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Name and email are required.');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    onSubmit(formData);
    setSuccess('Profile updated successfully!');
    setFormData((prev) => ({ ...prev, password: '' }));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}
    >
      <Typography variant="h5" mb={3} fontWeight="bold">
        Edit Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        helperText="Leave blank to keep current password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((show) => !show)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
        Save Changes
      </Button>
    </Box>
  );
};

export default ProfileForm;

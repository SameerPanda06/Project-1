import React from 'react';
import { Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';

const mockAdminProfile = {
  name: 'Admin User',
  email: 'admin@example.com',
};

const AdminProfile = () => {
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    // Replace alert with real API call to save profile data
    alert('Profile saved for Admin:\n' + JSON.stringify(data, null, 2));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={() => navigate('/admin/dashboard')} sx={{ mb: 3 }}>
        Back to Dashboard
      </Button>

      {/* Render ProfileForm with initial data and submit handler */}
      <ProfileForm initialValues={mockAdminProfile} onSubmit={handleSubmit} />
    </Container>
  );
};

export default AdminProfile;

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  AppBar,
  Tabs,
  Tab,
  Box,
  useTheme,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const tabProps = (index) => ({
  id: `teacher-tab-${index}`,
  'aria-controls': `teacher-tabpanel-${index}`,
});

const TeacherDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/teacher/schedule');
        break;
      case 1:
        navigate('/teacher/notifications');
        break;
      case 2:
        navigate('/teacher/profile');
        break;
      case 3:
        navigate('/');
        break;
      default:
        break;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color={theme.palette.primary.main}>
        Teacher Dashboard
      </Typography>
      <Paper elevation={8} sx={{ borderRadius: 3 }}>
        <AppBar position="static" sx={{ bgcolor: theme.palette.background.paper }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="teacher dashboard tabs"
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ '& .MuiTab-root': { fontWeight: 'bold', fontSize: 16 } }}
          >
            <Tab icon={<EventNoteIcon />} iconPosition="start" label="View Schedule" {...tabProps(0)} />
            <Tab icon={<NotificationsActiveIcon />} iconPosition="start" label="Notifications" {...tabProps(1)} />
            <Tab icon={<AccountCircleIcon />} iconPosition="start" label="Profile" {...tabProps(2)} />
            <Tab icon={<LogoutIcon />} iconPosition="start" label="Logout" {...tabProps(3)} />
          </Tabs>
        </AppBar>
        <Box sx={{ p: 4 }}>
          {value === 0 && <Typography>Use the tabs to view your schedule.</Typography>}
          {value === 1 && <Typography>Check notifications.</Typography>}
          {value === 2 && <Typography>Manage your profile.</Typography>}
          {value === 3 && <Typography>Logging out...</Typography>}
        </Box>
      </Paper>
    </Container>
  );
};

export default TeacherDashboard;

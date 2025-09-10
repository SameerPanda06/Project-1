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
import ScheduleIcon from '@mui/icons-material/Schedule';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';

const tabProps = (index) => ({
  id: `admin-tab-${index}`,
  'aria-controls': `admin-tabpanel-${index}`,
});

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/admin/schedule');
        break;
      case 1:
        navigate('/admin/notifications');
        break;
      case 2:
        navigate('/admin/profile');
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SchoolIcon color="primary" sx={{ fontSize: 48, mr: 1 }} />
        <Typography variant="h4" fontWeight="bold" color="primary">
          Your School Name
        </Typography>
      </Box>
      <Typography variant="h3" fontWeight="bold" gutterBottom color={theme.palette.primary.main}>
        Admin Dashboard
      </Typography>
      <Paper elevation={8} sx={{ borderRadius: 3 }}>
        <AppBar position="static" sx={{ bgcolor: theme.palette.background.paper }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="admin dashboard tabs"
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ '& .MuiTab-root': { fontWeight: 'bold', fontSize: 16 } }}
          >
            <Tab icon={<ScheduleIcon />} iconPosition="start" label="Manage Schedule" {...tabProps(0)} />
            <Tab icon={<NotificationsActiveIcon />} iconPosition="start" label="Notifications" {...tabProps(1)} />
            <Tab icon={<AccountCircleIcon />} iconPosition="start" label="Profile" {...tabProps(2)} />
            <Tab icon={<LogoutIcon />} iconPosition="start" label="Logout" {...tabProps(3)} />
          </Tabs>
        </AppBar>
        <Box sx={{ p: 4 }}>
          {value === 0 && <Typography>Use the tabs to manage schedules.</Typography>}
          {value === 1 && <Typography>Check Notifications.</Typography>}
          {value === 2 && <Typography>Manage your Profile.</Typography>}
          {value === 3 && <Typography>Logging out...</Typography>}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Notifications from '../components/Notifications';

const initialNotifications = [
  { id: 1, title: 'Holiday Notice', message: 'School closed on Friday due to holiday' },
  { id: 2, title: 'Exam Schedule', message: 'Midterms start next week' },
];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [newNotification, setNewNotification] = useState({ title: '', message: '' });

  const handleChange = (e) => {
    setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!newNotification.title || !newNotification.message) return;
    setNotifications((prev) => [...prev, { id: Date.now(), ...newNotification }]);
    setNewNotification({ title: '', message: '' });
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Manage Notifications
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>Add New Notification</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={newNotification.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Message"
            name="message"
            value={newNotification.message}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          <Button variant="contained" onClick={handleAdd}>
            Add Notification
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Current Notifications</Typography>
        <List>
          {notifications.map(({ id, title, message }) => (
            <ListItem
              key={id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={title} secondary={message} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Notifications Preview
        </Typography>
        <Notifications notifications={notifications} />
      </Box>
    </Container>
  );
};

export default AdminNotifications;

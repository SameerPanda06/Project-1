import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventNoteIcon from '@mui/icons-material/EventNote';

const Notifications = ({ notifications }) => (
  <Box>
    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
      Notifications
    </Typography>
    <Paper elevation={3} sx={{ maxHeight: 400, overflowY: 'auto', p: 2, borderRadius: 2 }}>
      <List>
        {notifications.length === 0 ? (
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mt: 4 }}>
            No notifications to display.
          </Typography>
        ) : (
          notifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: notif.type === 'leave' ? 'secondary.main' : 'primary.main' }}>
                    {notif.type === 'leave' ? <EventNoteIcon /> : <NotificationsActiveIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notif.title}
                  secondary={
                    <Typography component="span" variant="body2" color="textPrimary">
                      {notif.message}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  </Box>
);

export default Notifications;


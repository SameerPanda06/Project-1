import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  useTheme,
} from '@mui/material';

// Mock timetable data for student
const timetableData = {
  Monday: [{ time: '9:00-10:00', subject: 'Math', classroom: '101' }],
  Tuesday: [
    { time: '10:00-11:00', subject: 'Physics', classroom: '102' },
    { time: '2:00-3:00', subject: 'English', classroom: '103' },
  ],
  Wednesday: [{ time: '11:00-12:00', subject: 'Chemistry', classroom: '101' }],
  Thursday: [],
  Friday: [{ time: '1:00-2:00', subject: 'Biology', classroom: '102' }],
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '1:00-2:00', '2:00-3:00'];

const StudentTimetable = () => {
  const theme = useTheme();

  const getClassForSlot = (day, slot) => {
    const classes = timetableData[day] || [];
    return classes.find((cls) => cls.time === slot) || null;
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color={theme.palette.primary.main}>
        Student Timetable
      </Typography>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 3, overflowX: 'auto' }}>
        <Grid container spacing={0} sx={{ minWidth: 720 }}>
          <Grid item xs={2} sx={{ borderBottom: 1, borderRight: 1, borderColor: 'divider', p: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Time / Day
            </Typography>
          </Grid>
          {days.map((day) => (
            <Grid
              key={day}
              item
              xs={2}
              sx={{
                borderBottom: 1,
                borderRight: 1,
                borderColor: 'divider',
                backgroundColor: theme.palette.action.hover,
                p: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {day}
              </Typography>
            </Grid>
          ))}
          {times.map((slot) => (
            <React.Fragment key={slot}>
              <Grid
                item
                xs={2}
                sx={{
                  borderBottom: 1,
                  borderRight: 1,
                  borderColor: 'divider',
                  p: 1,
                  fontWeight: 'medium',
                }}
              >
                {slot}
              </Grid>
              {days.map((day) => {
                const cls = getClassForSlot(day, slot);
                return (
                  <Grid
                    key={`${day}-${slot}`}
                    item
                    xs={2}
                    sx={{
                      borderBottom: 1,
                      borderRight: 1,
                      borderColor: 'divider',
                      p: 1,
                      minHeight: 60,
                    }}
                  >
                    {cls ? (
                      <>
                        <Typography variant="subtitle2">{cls.subject}</Typography>
                        <Typography variant="caption">{cls.classroom}</Typography>
                      </>
                    ) : null}
                  </Grid>
                );
              })}
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default StudentTimetable;

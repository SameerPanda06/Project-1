import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { jsPDF } from 'jspdf';

const initialSchedules = [
  { id: 1, day: 'Monday', time: '9:00-10:00', subject: 'Math', teacher: 'John Doe', classroom: '101' },
  { id: 2, day: 'Tuesday', time: '10:00-11:00', subject: 'Physics', teacher: 'Jane Smith', classroom: '102' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '1:00-2:00', '2:00-3:00'];

const AdminSchedule = () => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [form, setForm] = useState({
    day: '',
    time: '',
    subject: '',
    teacher: '',
    classroom: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = () => {
    if (!form.day || !form.time || !form.subject || !form.teacher || !form.classroom) return;
    setSchedules((prev) => [...prev, { id: Date.now(), ...form }]);
    setForm({ day: '', time: '', subject: '', teacher: '', classroom: '' });
  };

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text('Class Schedule', 10, 10);
    let y = 20;
    schedules.forEach((s) => {
      doc.text(`${s.day} - ${s.time} - ${s.subject} - ${s.teacher} - ${s.classroom}`, 10, y);
      y += 10;
    });
    doc.save('schedule.pdf');
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Manage Schedule
      </Typography>
      <Paper elevation={4} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Day"
              name="day"
              value={form.day}
              onChange={handleChange}
              SelectProps={{ native: true }}
              fullWidth
            >
              <option value="" />
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Time"
              name="time"
              value={form.time}
              onChange={handleChange}
              SelectProps={{ native: true }}
              fullWidth
            >
              <option value="" />
              {times.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Teacher"
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Classroom"
              name="classroom"
              value={form.classroom}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add Schedule
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleExport} sx={{ ml: 2 }}>
            Export PDF
          </Button>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, maxHeight: 360, overflow: 'auto' }}>
        <Typography variant="h6" mb={2}>Current Schedule</Typography>
        {schedules.map((s) => (
          <Paper key={s.id} sx={{ p: 1, mb: 1 }}>
            {`${s.day} ${s.time} - ${s.subject} by ${s.teacher} in room ${s.classroom}`}
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default AdminSchedule;

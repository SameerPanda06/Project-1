const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-super-secret-key-that-is-long-and-random';

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

async function setupDatabase() {
    const client = await pool.connect();
    try {
        console.log("Connected to the database successfully!");

        console.log("Forcing database reset: Dropping existing tables...");
        await client.query('DROP TABLE IF EXISTS notifications, timetable, teacher_leaves, faculty_subject_assignments, students, batches, subjects, faculty, classrooms, users CASCADE');
        console.log("Tables dropped successfully.");
        
        const queries = [
            `CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(50) NOT NULL)`,
            `CREATE TABLE classrooms (id SERIAL PRIMARY KEY, class_id VARCHAR(20) UNIQUE NOT NULL, name VARCHAR(100) NOT NULL, capacity INT NOT NULL, type VARCHAR(50) NOT NULL)`,
            `CREATE TABLE faculty (id SERIAL PRIMARY KEY, teacher_id VARCHAR(50) UNIQUE NOT NULL, name VARCHAR(100) NOT NULL, department VARCHAR(100), user_id INT REFERENCES users(id) ON DELETE CASCADE)`,
            `CREATE TABLE subjects (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, code VARCHAR(20) UNIQUE NOT NULL, credits INT NOT NULL, department VARCHAR(100))`,
            `CREATE TABLE batches (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, year INT NOT NULL, semester INT NOT NULL, department VARCHAR(100), shift VARCHAR(20) NOT NULL)`,
            `CREATE TABLE students (id SERIAL PRIMARY KEY, student_id VARCHAR(50) UNIQUE NOT NULL, name VARCHAR(100) NOT NULL, batch_id INT REFERENCES batches(id) ON DELETE CASCADE, user_id INT REFERENCES users(id) ON DELETE CASCADE)`,
            `CREATE TABLE faculty_subject_assignments (faculty_id INT REFERENCES faculty(id) ON DELETE CASCADE, subject_id INT REFERENCES subjects(id) ON DELETE CASCADE, PRIMARY KEY (faculty_id, subject_id))`,
            `CREATE TABLE teacher_leaves (id SERIAL PRIMARY KEY, faculty_id INT REFERENCES faculty(id) ON DELETE CASCADE NOT NULL, leave_date DATE NOT NULL, reason TEXT, status VARCHAR(20) NOT NULL DEFAULT 'pending', UNIQUE(faculty_id, leave_date))`,
            `CREATE TABLE timetable (id SERIAL PRIMARY KEY, day VARCHAR(20) NOT NULL, time_slot VARCHAR(50) NOT NULL, subject_id INT REFERENCES subjects(id), faculty_id INT REFERENCES faculty(id), classroom_id INT REFERENCES classrooms(id), batch_id INT REFERENCES batches(id), UNIQUE(day, time_slot, classroom_id), UNIQUE(day, time_slot, faculty_id), UNIQUE(day, time_slot, batch_id))`,
            `CREATE TABLE notifications (id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, message TEXT NOT NULL, recipient_role VARCHAR(50) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`
        ];
        for (const query of queries) { await client.query(query); }
        console.log("All tables re-created successfully.");

        console.log("Seeding initial data...");
        const hashedPassword = await bcrypt.hash('password123', 10);
        await client.query("INSERT INTO users (email, password, role) VALUES ('admin@schedu.com', $1, 'admin')", [await bcrypt.hash('admin123', 10)]);
        
        const subjects = [
            { name: 'Intro to Programming', code: 'CS101', credits: 4, department: 'Computer Science' }, { name: 'Data Structures', code: 'CS201', credits: 4, department: 'Computer Science' },
            { name: 'Algorithms', code: 'CS301', credits: 3, department: 'Computer Science' }, { name: 'Operating Systems', code: 'CS302', credits: 3, department: 'Computer Science' },
            { name: 'Databases', code: 'CS303', credits: 3, department: 'Computer Science' }, { name: 'Networking', code: 'CS401', credits: 3, department: 'Computer Science' },
            { name: 'Software Engineering', code: 'SE202', credits: 4, department: 'Software Engineering' }, { name: 'Web Development', code: 'WD404', credits: 3, department: 'Software Engineering' },
            { name: 'Calculus I', code: 'MA101', credits: 4, department: 'Mathematics' }, { name: 'Linear Algebra', code: 'MA202', credits: 3, department: 'Mathematics' },
            { name: 'Classical Mechanics', code: 'PHY101', credits: 4, department: 'Physics' }, { name: 'Electromagnetism', code: 'PHY201', credits: 4, department: 'Physics' }
        ];
        const subjectIds = {};
        for (const sub of subjects) {
            const res = await client.query("INSERT INTO subjects (name, code, credits, department) VALUES ($1, $2, $3, $4) RETURNING id", [sub.name, sub.code, sub.credits, sub.department]);
            subjectIds[sub.department] = subjectIds[sub.department] || [];
            subjectIds[sub.department].push(res.rows[0].id);
        }
        
        const batches = [{ name: 'CS 2025 Morning', year: 2, semester: 3, department: 'Computer Science', shift: 'Morning' }, { name: 'CS 2025 Evening', year: 2, semester: 3, department: 'Computer Science', shift: 'Evening' }, { name: 'CS 2026 Morning', year: 1, semester: 1, department: 'Computer Science', shift: 'Morning' }];
        const batchIds = [];
        for (const b of batches) {
            const res = await client.query("INSERT INTO batches (name, year, semester, department, shift) VALUES ($1, $2, $3, $4, $5) RETURNING id", [b.name, b.year, b.semester, b.department, b.shift]);
            batchIds.push(res.rows[0].id);
        }
        
        console.log("Creating guaranteed users for testing...");
        // Teacher
        let userResTeacher = await client.query("INSERT INTO users (email, password, role) VALUES ($1, $2, 'teacher') RETURNING id", ['teacher@schedu.com', hashedPassword]);
        let facultyResTeacher = await client.query("INSERT INTO faculty (teacher_id, name, department, user_id) VALUES ($1, $2, $3, $4) RETURNING id", [`T001`, `Guaranteed Teacher`, 'Computer Science', userResTeacher.rows[0].id]);
        const guaranteedTeacherId = facultyResTeacher.rows[0].id;
        // CORRECTED: Assign subjects to the guaranteed teacher
        const csSubjects = subjectIds['Computer Science'];
        await client.query("INSERT INTO faculty_subject_assignments (faculty_id, subject_id) VALUES ($1, $2)", [guaranteedTeacherId, csSubjects[0]]);
        await client.query("INSERT INTO faculty_subject_assignments (faculty_id, subject_id) VALUES ($1, $2)", [guaranteedTeacherId, csSubjects[1]]);

        // Student
        let userResStudent = await client.query("INSERT INTO users (email, password, role) VALUES ($1, $2, 'student') RETURNING id", ['student@schedu.com', hashedPassword]);
        await client.query("INSERT INTO students (student_id, name, batch_id, user_id) VALUES ($1, $2, $3, $4)", [`S001`, `Guaranteed Student`, batchIds[0], userResStudent.rows[0].id]);
        console.log("Guaranteed users created and assigned subjects successfully.");

        const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Priya", "Saanvi", "Anya", "Aadhya", "Ananya", "Diya", "Navya", "Riya", "Myra", "Anika", "Rohan", "Advik", "Kabir", "Ansh", "Veer"];
        const lastNames = ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Shah", "Khan", "Das", "Panda", "Mohanty", "Mishra", "Jena", "Sahu", "Nayak", "Reddy", "Mehta", "Jain", "Chopra"];
        
        const teachers = [];
        const departments = ['Computer Science', 'Software Engineering', 'Mathematics', 'Physics'];
        for (let i = 1; i <= 20; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase();
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
            const fullName = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;
            const email = `${firstName}.${lastName}${i}@schedu.com`;
            const department = departments[i % departments.length];
            
            const userRes = await client.query("INSERT INTO users (email, password, role) VALUES ($1, $2, 'teacher') RETURNING id", [email, hashedPassword]);
            const facultyRes = await client.query("INSERT INTO faculty (teacher_id, name, department, user_id) VALUES ($1, $2, $3, $4) RETURNING id", [`T${100+i}`, fullName, department, userRes.rows[0].id]);
            const teacherId = facultyRes.rows[0].id;
            teachers.push(teacherId);

            const deptSubjects = subjectIds[department];
            if (deptSubjects && deptSubjects.length > 0) {
                await client.query("INSERT INTO faculty_subject_assignments (faculty_id, subject_id) VALUES ($1, $2)", [teacherId, deptSubjects[0]]);
                if (deptSubjects.length > 1) {
                    await client.query("INSERT INTO faculty_subject_assignments (faculty_id, subject_id) VALUES ($1, $2)", [teacherId, deptSubjects[1]]);
                }
            }
        }
        
        for (let i = 1; i <= 80; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase();
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
            const fullName = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;
            const email = `${firstName}.${lastName}${i}@schedu.com`;
            
            const userRes = await client.query("INSERT INTO users (email, password, role) VALUES ($1, $2, 'student') RETURNING id", [email, hashedPassword]);
            await client.query("INSERT INTO students (student_id, name, batch_id, user_id) VALUES ($1, $2, $3, $4)", [`S${1000+i}`, fullName, batchIds[i % batchIds.length], userRes.rows[0].id]);
        }

        for (let i = 1; i <= 25; i++) {
            const type = i <= 15 ? 'Lecture Hall' : 'Lab';
            const capacity = type === 'Lab' ? 30 : 60;
            await client.query("INSERT INTO classrooms (class_id, name, capacity, type) VALUES ($1, $2, $3, $4)", [`CL${100+i}`,`Room ${100+i}`, capacity, type]);
        }
        console.log("Seeding complete.");
    } catch (err) {
        console.error("Error during database setup:", err);
    } finally {
        client.release();
    }
}

// --- API Endpoints ---
app.post('/api/login', async (req, res) => {
    const { username: email, password, role } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, role]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });
        
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

        let profile = {};
        if (user.role === 'teacher') {
            const profileRes = await pool.query('SELECT id, name FROM faculty WHERE user_id = $1', [user.id]);
            if (profileRes.rows.length > 0) profile = { profileId: profileRes.rows[0].id, name: profileRes.rows[0].name };
        } else if (user.role === 'student') {
            const profileRes = await pool.query('SELECT id, name, batch_id FROM students WHERE user_id = $1', [user.id]);
            if (profileRes.rows.length > 0) profile = { profileId: profileRes.rows[0].id, name: profileRes.rows[0].name, batchId: profileRes.rows[0].batch_id };
        } else {
             profile = { name: 'Admin User' };
        }
        
        const tokenPayload = { id: user.id, email: user.email, role: user.role, ...profile };
        const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

        res.json({ success: true, accessToken, user: tokenPayload });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// --- SECURE ENDPOINTS ---
app.get('/api/classrooms', authenticateToken, async (req, res) => {
    try { const result = await pool.query('SELECT * FROM classrooms ORDER BY name'); res.json(result.rows); }
    catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/classrooms', authenticateToken, async (req, res) => {
    const { name, capacity, type } = req.body;
    try { const result = await pool.query('INSERT INTO classrooms (name, capacity, type, class_id) VALUES ($1, $2, $3, $4) RETURNING *', [name, capacity, type, `CL${Math.floor(Math.random()*1000)}`]); res.status(201).json(result.rows[0]); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/faculty', authenticateToken, async (req, res) => {
    try { const result = await pool.query('SELECT * FROM faculty ORDER BY name'); res.json(result.rows); }
    catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/faculty', authenticateToken, async (req, res) => {
    const { name, department } = req.body;
    try { const result = await pool.query('INSERT INTO faculty (name, department, teacher_id) VALUES ($1, $2, $3) RETURNING *', [name, department, `T${Math.floor(Math.random()*1000)}`]); res.status(201).json(result.rows[0]); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/subjects', authenticateToken, async (req, res) => {
    try { const result = await pool.query('SELECT * FROM subjects ORDER BY name'); res.json(result.rows); }
    catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/subjects', authenticateToken, async (req, res) => {
    const { name, code, credits } = req.body;
    try { const result = await pool.query('INSERT INTO subjects (name, code, credits) VALUES ($1, $2, $3) RETURNING *', [name, code, credits]); res.status(201).json(result.rows[0]); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/students', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT s.id, s.name, s.student_id, b.name as batch_name FROM students s JOIN batches b ON s.batch_id = b.id ORDER BY s.name');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/leaves', authenticateToken, async (req, res) => {
    const { faculty_id, leave_dates, reason } = req.body;
    if (!leave_dates || leave_dates.length === 0) return res.status(400).json({ error: 'At least one leave date is required.' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        for (const date of leave_dates) {
            const leaveMonth = new Date(date).getMonth() + 1;
            const leaveYear = new Date(date).getFullYear();
            
            const leaveCountRes = await client.query(`SELECT COUNT(*) FROM teacher_leaves WHERE faculty_id = $1 AND status = 'approved' AND EXTRACT(MONTH FROM leave_date) = $2 AND EXTRACT(YEAR FROM leave_date) = $3`, [faculty_id, leaveMonth, leaveYear]);
            const leaveCount = parseInt(leaveCountRes.rows[0].count, 10);

            if (leaveCount >= 4) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: `Monthly leave limit of 4 days reached for month ${leaveMonth}/${leaveYear}.` });
            }
             await client.query('INSERT INTO teacher_leaves (faculty_id, leave_date, reason) VALUES ($1, $2, $3)', [faculty_id, date, reason]);
        }
        
        await client.query('COMMIT');
        res.status(201).json({ message: 'Leave requests submitted successfully.' });
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') return res.status(400).json({ error: 'A leave request for one of these dates already exists.' });
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});
app.get('/api/leaves', authenticateToken, async (req, res) => {
    try { const result = await pool.query(`SELECT tl.id, tl.leave_date, tl.reason, tl.status, f.name as faculty_name FROM teacher_leaves tl JOIN faculty f ON tl.faculty_id = f.id ORDER BY tl.status = 'pending' DESC, tl.leave_date ASC`); res.json(result.rows); }
    catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/leaves/teacher/:faculty_id', authenticateToken, async (req, res) => {
    try { const result = await pool.query('SELECT * FROM teacher_leaves WHERE faculty_id = $1 ORDER BY leave_date DESC', [req.params.faculty_id]); res.json(result.rows); }
    catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/leaves/:id', authenticateToken, async (req, res) => {
    const { status } = req.body;
    try { const result = await pool.query('UPDATE teacher_leaves SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]); res.json(result.rows[0]); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/timetable', authenticateToken, async (req, res) => {
    try { const result = await pool.query(`SELECT t.day, t.time_slot, s.name as subject_name, c.name as classroom_name, f.name as faculty_name, b.name as batch_name FROM timetable t JOIN subjects s ON t.subject_id = s.id JOIN classrooms c ON t.classroom_id = c.id JOIN faculty f ON t.faculty_id = f.id JOIN batches b ON t.batch_id = b.id ORDER BY t.day, t.time_slot`); res.json(result.rows); }
    catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/timetable/teacher/:facultyId', authenticateToken, async (req, res) => {
    try { const result = await pool.query(`SELECT t.day, t.time_slot, s.name as subject_name, c.name as classroom_name, b.name as batch_name FROM timetable t JOIN subjects s ON t.subject_id = s.id JOIN classrooms c ON t.classroom_id = c.id JOIN batches b ON t.batch_id = b.id WHERE t.faculty_id = $1 ORDER BY t.day, t.time_slot`, [req.params.facultyId]); res.json(result.rows); }
    catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/timetable/student/:batchId', authenticateToken, async (req, res) => {
    try { const result = await pool.query(`SELECT t.day, t.time_slot, s.name as subject_name, c.name as classroom_name, f.name as faculty_name FROM timetable t JOIN subjects s ON t.subject_id = s.id JOIN classrooms c ON t.classroom_id = c.id JOIN faculty f ON t.faculty_id = f.id WHERE t.batch_id = $1 ORDER BY t.day, t.time_slot`, [req.params.batchId]); res.json(result.rows); }
    catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/timetable/generate', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('TRUNCATE TABLE timetable RESTART IDENTITY');
        
        console.log("Starting timetable generation...");

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const morningSlots = ['09:00-10:00', '10:00-11:00', '11:00-12:00'];
        const eveningSlots = ['02:00-03:00', '03:00-04:00', '04:00-05:00'];
        
        const { rows: batches } = await client.query('SELECT * FROM batches');
        const { rows: classrooms } = await client.query('SELECT * FROM classrooms');
        const { rows: subjects } = await client.query('SELECT * FROM subjects');
        const { rows: teacherAssignments } = await client.query('SELECT faculty_id, subject_id FROM faculty_subject_assignments');

        const subjectToTeachers = {};
        teacherAssignments.forEach(a => {
            if (!subjectToTeachers[a.subject_id]) {
                subjectToTeachers[a.subject_id] = [];
            }
            subjectToTeachers[a.subject_id].push(a.faculty_id);
        });

        const schedule = {};

        for (const batch of batches) {
            const timeSlots = batch.shift === 'Morning' ? morningSlots : eveningSlots;
            const batchSubjects = subjects.filter(s => s.department === batch.department);
            
            for (const day of days) {
                for (const slot of timeSlots) {
                    if (!schedule[day]) schedule[day] = {};
                    if (!schedule[day][slot]) schedule[day][slot] = { busyTeachers: new Set(), busyClassrooms: new Set(), busyBatches: new Set() };
                    
                    if (schedule[day][slot].busyBatches.has(batch.id)) continue;

                    const availableSubjects = batchSubjects.filter(s => {
                        const teachersForSub = subjectToTeachers[s.id];
                        if (!teachersForSub) return false;
                        return teachersForSub.some(t => !schedule[day][slot].busyTeachers.has(t));
                    });

                    if (availableSubjects.length > 0) {
                        const subject = availableSubjects[Math.floor(Math.random() * availableSubjects.length)];
                        const availableTeachers = subjectToTeachers[subject.id].filter(t => !schedule[day][slot].busyTeachers.has(t));
                        const availableClassrooms = classrooms.filter(c => !schedule[day][slot].busyClassrooms.has(c.id));

                        if (availableTeachers.length > 0 && availableClassrooms.length > 0) {
                            const teacherId = availableTeachers[0];
                            const classroomId = availableClassrooms[0].id;

                            await client.query(
                                'INSERT INTO timetable (day, time_slot, subject_id, faculty_id, classroom_id, batch_id) VALUES ($1, $2, $3, $4, $5, $6)',
                                [day, slot, subject.id, teacherId, classroomId, batch.id]
                            );

                            schedule[day][slot].busyTeachers.add(teacherId);
                            schedule[day][slot].busyClassrooms.add(classroomId);
                            schedule[day][slot].busyBatches.add(batch.id);
                        }
                    }
                }
            }
        }

        await client.query('COMMIT');
        console.log("Timetable generation completed successfully.");
        res.status(201).json({ message: 'Dynamic timetable generated successfully!' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Timetable generation error:", err);
        res.status(500).json({ error: "Failed to generate timetable. " + err.message });
    } finally {
        client.release();
    }
});

app.post('/api/notifications', authenticateToken, async (req, res) => {
    const { title, message, recipient_role } = req.body;
    try { const result = await pool.query('INSERT INTO notifications (title, message, recipient_role) VALUES ($1, $2, $3) RETURNING *', [title, message, recipient_role]); res.status(201).json(result.rows[0]); }
    catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/notifications/:role', authenticateToken, async (req, res) => {
    const { role } = req.params;
    try { const result = await pool.query("SELECT * FROM notifications WHERE recipient_role = 'all' OR recipient_role = $1 ORDER BY created_at DESC", [role]); res.json(result.rows); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Schedu backend server listening on port ${PORT}`);
    await setupDatabase();
});
-- This script creates the entire database schema and seeds it with guaranteed users.
-- It will only run the first time a new database volume is created.

-- Create Tables
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE public.classrooms (
    id SERIAL PRIMARY KEY,
    class_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    type VARCHAR(50) NOT NULL
);

CREATE TABLE public.faculty (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    user_id INT REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    credits INT NOT NULL,
    department VARCHAR(100)
);

CREATE TABLE public.batches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    semester INT NOT NULL,
    department VARCHAR(100),
    shift VARCHAR(20) NOT NULL
);

CREATE TABLE public.students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    batch_id INT REFERENCES public.batches(id) ON DELETE CASCADE,
    user_id INT REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.faculty_subject_assignments (
    faculty_id INT REFERENCES public.faculty(id) ON DELETE CASCADE,
    subject_id INT REFERENCES public.subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (faculty_id, subject_id)
);

CREATE TABLE public.teacher_leaves (
    id SERIAL PRIMARY KEY,
    faculty_id INT REFERENCES public.faculty(id) ON DELETE CASCADE NOT NULL,
    leave_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    UNIQUE(faculty_id, leave_date)
);

CREATE TABLE public.timetable (
    id SERIAL PRIMARY KEY,
    day VARCHAR(20) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    subject_id INT REFERENCES public.subjects(id),
    faculty_id INT REFERENCES public.faculty(id),
    classroom_id INT REFERENCES public.classrooms(id),
    batch_id INT REFERENCES public.batches(id),
    UNIQUE(day, time_slot, classroom_id),
    UNIQUE(day, time_slot, faculty_id),
    UNIQUE(day, time_slot, batch_id)
);

CREATE TABLE public.notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    recipient_role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Data
-- Passwords: admin is 'admin123', all others are 'password123'
INSERT INTO public.users (email, password, role) VALUES
('admin@schedu.com', '$2a$10$f5.i4fV1jeaV5j23fB5hbe2d6y405b7GObp2aAZ58d689GfE0.j/.', 'admin'),
('arjun.reddy@schedu.com', '$2a$10$wAXQ0f9v9L8sC4eRctGq6uMBR05k5eSFv6iGsoL8y/Wc5cWT/j0mK', 'teacher'),
('priya.sharma@schedu.com', '$2a$10$wAXQ0f9v9L8sC4eRctGq6uMBR05k5eSFv6iGsoL8y/Wc5cWT/j0mK', 'student');

INSERT INTO public.batches (name, year, semester, department, shift) VALUES
('CS 2025 Morning', 2, 3, 'Computer Science', 'Morning'),
('CS 2025 Evening', 2, 3, 'Computer Science', 'Evening');

INSERT INTO public.faculty (teacher_id, name, department, user_id) VALUES
('T001', 'Arjun Reddy', 'Computer Science', 2);

INSERT INTO public.students (student_id, name, batch_id, user_id) VALUES
('S001', 'Priya Sharma', 1, 3);
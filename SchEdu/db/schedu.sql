--
-- PostgreSQL database dump
--

\restrict JsNcMeCF7yttNLb6gprX26bDnqqNmLfRhFdJdEKBTRYrhctIIkQ0luPA57ZEH8B

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-09 21:14:06

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 859 (class 1247 OID 23735)
-- Name: enum_leaves_leave_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_leaves_leave_type AS ENUM (
    'sick',
    'casual',
    'emergency',
    'maternity',
    'study'
);


ALTER TYPE public.enum_leaves_leave_type OWNER TO postgres;

--
-- TOC entry 862 (class 1247 OID 23746)
-- Name: enum_leaves_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_leaves_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'processed'
);


ALTER TYPE public.enum_leaves_status OWNER TO postgres;

--
-- TOC entry 886 (class 1247 OID 23806)
-- Name: enum_notifications_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_notifications_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


ALTER TYPE public.enum_notifications_priority OWNER TO postgres;

--
-- TOC entry 883 (class 1247 OID 23796)
-- Name: enum_notifications_recipient_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_notifications_recipient_type AS ENUM (
    'individual',
    'role',
    'department',
    'broadcast'
);


ALTER TYPE public.enum_notifications_recipient_type OWNER TO postgres;

--
-- TOC entry 889 (class 1247 OID 23816)
-- Name: enum_notifications_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_notifications_status AS ENUM (
    'unread',
    'read',
    'dismissed'
);


ALTER TYPE public.enum_notifications_status OWNER TO postgres;

--
-- TOC entry 871 (class 1247 OID 23693)
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'teacher',
    'student',
    'admin'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 23713)
-- Name: classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classes (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    section character varying(50),
    department character varying(255),
    semester integer,
    academic_year character varying(15),
    capacity integer,
    room character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.classes OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 23712)
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classes_id_seq OWNER TO postgres;

--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 219
-- Name: classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;


--
-- TOC entry 224 (class 1259 OID 23756)
-- Name: leaves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leaves (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    leave_type public.enum_leaves_leave_type NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    reason text NOT NULL,
    status public.enum_leaves_status DEFAULT 'pending'::public.enum_leaves_status,
    applied_at timestamp with time zone,
    approved_at timestamp with time zone,
    approved_by integer,
    csp_processing_time integer DEFAULT 0,
    notifications_sent boolean DEFAULT false,
    priority integer DEFAULT 3,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.leaves OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 23755)
-- Name: leaves_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leaves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leaves_id_seq OWNER TO postgres;

--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 223
-- Name: leaves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leaves_id_seq OWNED BY public.leaves.id;


--
-- TOC entry 228 (class 1259 OID 23824)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    recipient_id integer NOT NULL,
    recipient_type public.enum_notifications_recipient_type DEFAULT 'individual'::public.enum_notifications_recipient_type,
    type character varying(50),
    title character varying(100) NOT NULL,
    message text NOT NULL,
    data jsonb,
    priority public.enum_notifications_priority DEFAULT 'medium'::public.enum_notifications_priority,
    status public.enum_notifications_status DEFAULT 'unread'::public.enum_notifications_status,
    scheduled_for timestamp with time zone,
    delivered_at timestamp with time zone,
    read_at timestamp with time zone,
    expires_at timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 23823)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 227
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 222 (class 1259 OID 23723)
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    department character varying(255),
    semester integer,
    credits integer,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 23722)
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subjects_id_seq OWNER TO postgres;

--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 221
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects.id;


--
-- TOC entry 230 (class 1259 OID 23842)
-- Name: system_setup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_setup (
    id integer NOT NULL,
    academic_year character varying(15) NOT NULL,
    current_semester integer NOT NULL,
    working_days jsonb DEFAULT '["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]'::jsonb,
    periods_per_day integer DEFAULT 8,
    period_duration integer DEFAULT 50,
    break_times jsonb,
    csp_settings jsonb,
    leave_settings jsonb,
    notification_settings jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.system_setup OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 23841)
-- Name: system_setup_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_setup_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_setup_id_seq OWNER TO postgres;

--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 229
-- Name: system_setup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_setup_id_seq OWNED BY public.system_setup.id;


--
-- TOC entry 226 (class 1259 OID 23780)
-- Name: timetables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.timetables (
    id integer NOT NULL,
    class_id integer NOT NULL,
    academic_year character varying(15),
    semester integer,
    schedule jsonb NOT NULL,
    version integer DEFAULT 1,
    last_optimized timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.timetables OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 23779)
-- Name: timetables_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.timetables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.timetables_id_seq OWNER TO postgres;

--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 225
-- Name: timetables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.timetables_id_seq OWNED BY public.timetables.id;


--
-- TOC entry 218 (class 1259 OID 23700)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    department character varying(255),
    leave_balance integer DEFAULT 20,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 23699)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4793 (class 2604 OID 23716)
-- Name: classes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);


--
-- TOC entry 4797 (class 2604 OID 23759)
-- Name: leaves id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves ALTER COLUMN id SET DEFAULT nextval('public.leaves_id_seq'::regclass);


--
-- TOC entry 4806 (class 2604 OID 23827)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 23726)
-- Name: subjects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects ALTER COLUMN id SET DEFAULT nextval('public.subjects_id_seq'::regclass);


--
-- TOC entry 4811 (class 2604 OID 23845)
-- Name: system_setup id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_setup ALTER COLUMN id SET DEFAULT nextval('public.system_setup_id_seq'::regclass);


--
-- TOC entry 4803 (class 2604 OID 23783)
-- Name: timetables id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timetables ALTER COLUMN id SET DEFAULT nextval('public.timetables_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 23703)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4986 (class 0 OID 23713)
-- Dependencies: 220
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classes (id, name, section, department, semester, academic_year, capacity, room, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4990 (class 0 OID 23756)
-- Dependencies: 224
-- Data for Name: leaves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leaves (id, teacher_id, leave_type, start_date, end_date, reason, status, applied_at, approved_at, approved_by, csp_processing_time, notifications_sent, priority, is_active, created_at, updated_at) FROM stdin;
1	1	sick	2025-09-01	2025-09-05	Health issues	processed	2025-09-09 19:07:36.802+05:30	2025-09-09 19:07:36.811+05:30	1	2	f	1	t	2025-09-09 19:07:36.802+05:30	2025-09-09 19:07:36.815+05:30
\.


--
-- TOC entry 4994 (class 0 OID 23824)
-- Dependencies: 228
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, recipient_id, recipient_type, type, title, message, data, priority, status, scheduled_for, delivered_at, read_at, expires_at, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4988 (class 0 OID 23723)
-- Dependencies: 222
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, name, code, department, semester, credits, description, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4996 (class 0 OID 23842)
-- Dependencies: 230
-- Data for Name: system_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_setup (id, academic_year, current_semester, working_days, periods_per_day, period_duration, break_times, csp_settings, leave_settings, notification_settings, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4992 (class 0 OID 23780)
-- Dependencies: 226
-- Data for Name: timetables; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.timetables (id, class_id, academic_year, semester, schedule, version, last_optimized, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4984 (class 0 OID 23700)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, role, first_name, last_name, department, leave_balance, is_active, created_at, updated_at) FROM stdin;
1	teacher@example.com	$2b$10$/C2C/WUQ8.5AR249bK5PMu8s1gl7/7QlVUCKSpqHs0N65x3pwghdW	teacher	Test	Teacher	\N	20	t	2025-09-09 19:07:36.73+05:30	2025-09-09 19:07:36.73+05:30
\.


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 219
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classes_id_seq', 1, false);


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 223
-- Name: leaves_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leaves_id_seq', 1, true);


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 227
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 221
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subjects_id_seq', 1, false);


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 229
-- Name: system_setup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_setup_id_seq', 1, false);


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 225
-- Name: timetables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.timetables_id_seq', 1, false);


--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4821 (class 2606 OID 23721)
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 23768)
-- Name: leaves leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_pkey PRIMARY KEY (id);


--
-- TOC entry 4831 (class 2606 OID 23835)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4823 (class 2606 OID 23733)
-- Name: subjects subjects_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_code_key UNIQUE (code);


--
-- TOC entry 4825 (class 2606 OID 23731)
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- TOC entry 4833 (class 2606 OID 23853)
-- Name: system_setup system_setup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_setup
    ADD CONSTRAINT system_setup_pkey PRIMARY KEY (id);


--
-- TOC entry 4829 (class 2606 OID 23789)
-- Name: timetables timetables_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timetables
    ADD CONSTRAINT timetables_pkey PRIMARY KEY (id);


--
-- TOC entry 4817 (class 2606 OID 23711)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4819 (class 2606 OID 23709)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 23774)
-- Name: leaves leaves_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- TOC entry 4835 (class 2606 OID 23769)
-- Name: leaves leaves_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4837 (class 2606 OID 23836)
-- Name: notifications notifications_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4836 (class 2606 OID 23790)
-- Name: timetables timetables_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timetables
    ADD CONSTRAINT timetables_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-09-09 21:14:07

--
-- PostgreSQL database dump complete
--

\unrestrict JsNcMeCF7yttNLb6gprX26bDnqqNmLfRhFdJdEKBTRYrhctIIkQ0luPA57ZEH8B


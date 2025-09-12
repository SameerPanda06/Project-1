import React, { useState, useEffect, useCallback } from 'react';

// --- API Fetcher with JWT ---
const API_URL = 'http://localhost:5000';

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('scheduToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('scheduUser');
        localStorage.removeItem('scheduToken');
        window.location.reload();
        throw new Error('Authentication failed');
    }

    return response;
};

// --- SVG Icons ---
const icons = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  classrooms: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  faculty: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  subjects: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>,
  students: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" /><path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
  notifications: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  generate: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  timetable: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  leave: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" /></svg>
};

// --- Main App Component ---
export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('scheduUser');
        const token = localStorage.getItem('scheduToken');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (loggedInUser, token) => {
        setUser(loggedInUser);
        localStorage.setItem('scheduUser', JSON.stringify(loggedInUser));
        localStorage.setItem('scheduToken', token);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('scheduUser');
        localStorage.removeItem('scheduToken');
    };

    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    switch (user.role) {
        case 'admin':
            return <AdminDashboard user={user} onLogout={handleLogout} />;
        case 'teacher':
            return <TeacherDashboard user={user} onLogout={handleLogout} />;
        case 'student':
            return <StudentDashboard user={user} onLogout={handleLogout} />;
        default:
            return <LoginPage onLogin={handleLogin} />;
    }
}

// --- Login Page Component ---
const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                onLogin(data.user, data.accessToken);
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            setError('Could not connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col items-center justify-center font-sans">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
                <h1 className="text-4xl font-bold text-center text-blue-900 mb-2">Schedu</h1>
                <p className="text-center text-gray-500 mb-6">Smart Scheduling System</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-2">I am a</label>
                        <div className="flex bg-gray-200 rounded-lg p-1">
                            {['admin', 'teacher', 'student'].map((r) => (
                                <button type="button" key={r} onClick={() => setRole(r)}
                                    className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${role === r ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-2" htmlFor="username">Email Address</label>
                        <input id="username" type="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g., admin@schedu.com"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2" htmlFor="password">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    <button type="submit" disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400">
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- Admin Dashboard ---
const AdminDashboard = ({ user, onLogout }) => {
    const [view, setView] = useState('dashboard');

    const viewTitles = {
        dashboard: 'Dashboard',
        classrooms: 'Manage Classrooms',
        faculty: 'Manage Faculty',
        subjects: 'Manage Subjects',
        students: 'Manage Students',
        notifications: 'Send Notifications',
        leaves: 'Leave Requests',
        generate: 'Generate Timetable',
        timetable: 'Master Timetable',
    };

    const renderView = () => {
        switch (view) {
            case 'classrooms': return <ManageData type="classrooms" title="Classrooms" fields={[{ name: 'name', placeholder: 'e.g. Room 101' }, { name: 'capacity', placeholder: 'e.g. 60', type: 'number' }, { name: 'type', placeholder: 'e.g. Lecture Hall' }]} />;
            case 'faculty': return <ManageData type="faculty" title="Faculty" fields={[{ name: 'name', placeholder: 'e.g. Dr. Smith' }, { name: 'department', placeholder: 'e.g. Computer Science' }]} />;
            case 'subjects': return <ManageData type="subjects" title="Subjects" fields={[{ name: 'name', placeholder: 'e.g. Data Structures' }, { name: 'code', placeholder: 'e.g. CS201' }, { name: 'credits', placeholder: 'e.g. 4', type: 'number' }]} />;
            case 'students': return <ManageStudents />;
            case 'notifications': return <ManageNotifications />;
            case 'leaves': return <ManageLeaves />;
            case 'generate': return <GenerateTimetableView />;
            case 'timetable': return <TimetableViewer user={user} />;
            default: return <AdminHome />;
        }
    };

    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen flex">
            <aside className="w-64 bg-white p-4 flex flex-col border-r border-gray-200">
                <div className="p-4 mb-4">
                    <h1 className="text-2xl font-bold text-blue-900">Schedu</h1>
                    <span className="text-xs text-gray-500">Admin Panel</span>
                </div>
                <nav className="flex flex-col space-y-2">
                    <AdminNavLink text="Dashboard" icon={icons.dashboard} active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                    <AdminNavLink text="Classrooms" icon={icons.classrooms} active={view === 'classrooms'} onClick={() => setView('classrooms')} />
                    <AdminNavLink text="Faculty" icon={icons.faculty} active={view === 'faculty'} onClick={() => setView('faculty')} />
                    <AdminNavLink text="Subjects" icon={icons.subjects} active={view === 'subjects'} onClick={() => setView('subjects')} />
                    <AdminNavLink text="Students" icon={icons.students} active={view === 'students'} onClick={() => setView('students')} />
                    <AdminNavLink text="Notifications" icon={icons.notifications} active={view === 'notifications'} onClick={() => setView('notifications')} />
                    <AdminNavLink text="Leave Requests" icon={icons.leave} active={view === 'leaves'} onClick={() => setView('leaves')} />
                    <AdminNavLink text="Generate" icon={icons.generate} active={view === 'generate'} onClick={() => setView('generate')} />
                    <AdminNavLink text="View Timetable" icon={icons.timetable} active={view === 'timetable'} onClick={() => setView('timetable')} />
                </nav>
                <div className="mt-auto p-4">
                     <p className="text-sm text-gray-500">Logged in as <span className="font-semibold text-gray-800">{user.email}</span></p>
                    <button onClick={onLogout} className="w-full mt-2 text-left py-2 px-3 rounded-lg text-red-600 hover:bg-red-100 transition-colors flex items-center space-x-2">
                       <span>→</span>
                       <span>Logout</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-blue-900">{viewTitles[view]}</h2>
                </header>
                {renderView()}
            </main>
        </div>
    );
};

const AdminNavLink = ({ text, icon, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center space-x-3 py-2 px-4 rounded-lg transition-colors text-left w-full ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}>
        <span className="w-6 h-6">{icon}</span>
        <span className="font-medium">{text}</span>
    </button>
);

const AdminHome = () => (
    <div className="space-y-8">
        <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Welcome, Admin!</h3>
            <p className="text-gray-600 max-w-3xl">
                This is your control center for the Schedu Smart Scheduling System. Use the sidebar to manage resources and generate the master timetable.
                Accurate data is the key to an optimal schedule.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <InfoCard
                title="1. Manage Resources"
                description="Add and review classrooms, faculty, and subjects before generating a schedule."
                icon={icons.classrooms}
            />
             <InfoCard
                title="2. Generate Timetable"
                description="Use the AI-powered engine to create a conflict-free schedule in minutes."
                icon={icons.generate}
            />
             <InfoCard
                title="3. View & Distribute"
                description="Review the master timetable and make it available for faculty and students."
                icon={icons.timetable}
            />
        </div>
    </div>
);

const InfoCard = ({ title, description, icon }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg">
        <div className="text-blue-600 w-8 h-8 mb-4">{icon}</div>
        <h3 className="font-bold text-blue-900 text-lg">{title}</h3>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
    </div>
);

const ManageData = ({ type, title, fields }) => {
    const [data, setData] = useState([]);
    const [newItem, setNewItem] = useState(fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {}));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetchWithAuth(`/api/${type}`);
            const result = await response.json();
            if (response.ok) {
                setData(result);
            } else {
                setError('Failed to fetch data.');
            }
        } catch (err) {
            if (err.message !== 'Authentication failed') {
                setError('Could not connect to the server.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [type]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchWithAuth(`/api/${type}`, {
                method: 'POST',
                body: JSON.stringify(newItem),
            });
            if (response.ok) {
                fetchData();
                setNewItem(fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {}));
            } else {
                alert(`Error adding ${type}`);
            }
        } catch (err) {
            alert('Server connection error.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
            try {
                const response = await fetchWithAuth(`/api/${type}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    fetchData();
                } else {
                    alert(`Error deleting ${type}`);
                }
            } catch (err) {
                alert('Server connection error.');
            }
        }
    };
    
    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium text-blue-900 mb-4">Add New {title.slice(0,-1)}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-600 capitalize">{field.name}</label>
                            <input type={field.type || 'text'} name={field.name} value={newItem[field.name]} onChange={handleInputChange} placeholder={field.placeholder}
                                className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                    ))}
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors h-10 md:col-start-3">Add</button>
                 </div>
            </form>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {fields.map(f => <th key={f.name} className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider capitalize">{f.name}</th>)}
                            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={fields.length + 1} className="text-center py-8 text-gray-500">Loading...</td></tr>
                        ) : error ? (
                            <tr><td colSpan={fields.length + 1} className="text-center py-8 text-red-500">{error}</td></tr>
                        ) : data.length === 0 ? (
                             <tr><td colSpan={fields.length + 1} className="text-center py-8 text-gray-400">No data available.</td></tr>
                        ) : data.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                {fields.map(f => <td key={f.name} className="py-4 px-6 text-sm text-gray-800">{item[f.name]}</td>)}
                                <td className="py-4 px-6 text-right">
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetchWithAuth('/api/students');
                const data = await response.json();
                if (response.ok) {
                    setStudents(data);
                } else {
                    setError('Failed to fetch students.');
                }
            } catch (err) {
                if (err.message !== 'Authentication failed') {
                    setError('Could not connect to the server.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, []);

    return (
         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                        <tr><td colSpan="3" className="text-center py-8 text-gray-500">Loading...</td></tr>
                    ) : error ? (
                        <tr><td colSpan="3" className="text-center py-8 text-red-500">{error}</td></tr>
                    ) : students.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                            <td className="py-4 px-6 text-sm text-gray-800 font-mono">{student.student_id}</td>
                            <td className="py-4 px-6 text-sm text-gray-800">{student.name}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{student.batch_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const GenerateTimetableView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const handleGenerate = async () => {
        setIsLoading(true);
        setMessage('');
        setIsError(false);
        try {
            const response = await fetchWithAuth('/api/timetable/generate', { method: 'POST' });
            const data = await response.json();
            if(response.ok) {
                setMessage(data.message || 'Timetable generated successfully!');
            } else {
                setIsError(true);
                setMessage(data.error || 'An unknown error occurred.');
            }
        } catch(err) {
            if (err.message !== 'Authentication failed') {
               setIsError(true);
               setMessage('Failed to connect to the server.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-blue-900 mb-4">AI Scheduling Engine</h3>
            <p className="text-gray-600 max-w-2xl mb-8">
                Click the button below to run the scheduling engine. This process will analyze all constraints, faculty availability, and classroom resources to create an optimized, conflict-free master timetable.
            </p>
            <button onClick={handleGenerate} disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                {isLoading ? 'Generating...' : <>{icons.generate} <span>Start Generation</span></>}
            </button>
            {message && (
                <div className={`mt-6 p-4 rounded-lg ${isError ? 'bg-red-100 border border-red-300 text-red-800' : 'bg-green-100 border border-green-300 text-green-800'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

// --- Personalized Timetable Viewer ---
const TimetableViewer = ({ user }) => {
    const [schedule, setSchedule] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
        '09:00-10:00', '10:00-11:00', '11:00-12:00',
        '12:00-01:00', // Lunch
        '01:00-02:00', '02:00-03:00', '03:00-04:00', '04:00-05:00'
    ];

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!user) return;
            let url = '/api/timetable';
            if (user.role === 'teacher') {
                url = `/api/timetable/teacher/${user.profileId}`;
            } else if (user.role === 'student') {
                url = `/api/timetable/student/${user.batchId}`;
            }

            try {
                const response = await fetchWithAuth(url);
                const data = await response.json();
                if (response.ok) {
                    const grid = {};
                    data.forEach(item => {
                        if (!grid[item.day]) grid[item.day] = {};
                        grid[item.day][item.time_slot] = item;
                    });
                    setSchedule(grid);
                } else {
                    setError('Failed to load timetable.');
                }
            } catch (err) {
                 if (err.message !== 'Authentication failed') {
                    setError('Could not connect to the server.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimetable();
    }, [user]);

    return (
         <div>
            {isLoading ? <p className="text-gray-500">Loading timetable...</p> : error ? <p className="text-red-500">{error}</p> :
            (
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 w-32 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                {days.map(day => <th key={day} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">{day}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {timeSlots.map(slot => (
                                <tr key={slot} className={`${slot === '12:00-01:00' ? 'bg-gray-100' : ''}`}>
                                    <td className="py-3 px-4 font-mono text-sm text-gray-500 align-middle">{slot}</td>
                                    {days.map(day => (
                                        <td key={day} className="py-2 px-2 align-top h-32 border-l border-gray-200">
                                            {slot === '12:00-01:00' ? (
                                                <div className="h-full flex items-center justify-center text-gray-400 text-sm font-semibold">Lunch Break</div>
                                            ) : schedule[day]?.[slot] ? (
                                                <div className="bg-blue-50 p-3 rounded-md border border-blue-200 h-full flex flex-col justify-between hover:shadow-lg transition-shadow">
                                                    <div>
                                                        <p className="font-bold text-sm text-blue-800">{schedule[day][slot].subject_name}</p>
                                                        {user.role !== 'teacher' && <p className="text-xs text-gray-600 font-medium">{schedule[day][slot].faculty_name}</p>}
                                                        {user.role !== 'student' && <p className="text-xs text-gray-500 italic">{schedule[day][slot].batch_name}</p>}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 font-semibold">📍 {schedule[day][slot].classroom_name}</p>
                                                </div>
                                            ) : null}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


// --- Notification Components ---
const ManageNotifications = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState('all');
    const [status, setStatus] = useState({ message: '', isError: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', isError: false });
        try {
            const response = await fetchWithAuth('/api/notifications', {
                method: 'POST',
                body: JSON.stringify({ title, message, recipient_role: recipient }),
            });
            if (response.ok) {
                setStatus({ message: 'Notification sent successfully!', isError: false });
                setTitle('');
                setMessage('');
            } else {
                 setStatus({ message: 'Failed to send notification.', isError: true });
            }
        } catch (err) {
            if (err.message !== 'Authentication failed') {
                setStatus({ message: 'Server connection error.', isError: true });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xl font-semibold text-blue-900">New Notification</h3>
             <div>
                <label className="block text-sm font-medium text-gray-600">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-600">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="5"
                    className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600">Send To</label>
                <select value={recipient} onChange={(e) => setRecipient(e.target.value)}
                    className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Users</option>
                    <option value="teacher">Teachers Only</option>
                    <option value="student">Students Only</option>
                </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">Send Notification</button>
            {status.message && (
                <p className={`text-sm text-center ${status.isError ? 'text-red-500' : 'text-green-600'}`}>{status.message}</p>
            )}
        </form>
    );
};

const NotificationViewer = ({ userRole }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetchWithAuth(`/api/notifications/${userRole}`);
                const data = await response.json();
                if(response.ok) {
                    setNotifications(data);
                }
            } catch (err) {
                 if (err.message !== 'Authentication failed') {
                    console.error("Failed to fetch notifications");
                 }
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotifications();
    }, [userRole]);

    return (
        <div className="space-y-4">
            {isLoading ? <p>Loading...</p> : notifications.length === 0 ? <p className="text-gray-500">No new notifications.</p> : (
                notifications.map(notif => (
                    <div key={notif.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-blue-800">{notif.title}</h4>
                            <span className="text-xs text-gray-400">{new Date(notif.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 mt-2">{notif.message}</p>
                    </div>
                ))
            )}
        </div>
    );
}

// --- Leave Management Components ---
const ManageLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeaves = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetchWithAuth('/api/leaves');
            const data = await response.json();
            if (response.ok) setLeaves(data);
        } catch (err) { 
             if (err.message !== 'Authentication failed') console.error(err);
        } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

    const handleUpdateStatus = async (id, status) => {
        try {
            await fetchWithAuth(`/api/leaves/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status }),
            });
            fetchLeaves();
        } catch (err) {
            alert('Failed to update status.');
        }
    };
    
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Faculty Name</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Leave Date</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {isLoading ? <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr> :
                     leaves.map(leave => (
                        <tr key={leave.id} className="hover:bg-gray-50">
                            <td className="py-4 px-6">{leave.faculty_name}</td>
                            <td className="py-4 px-6">{new Date(leave.leave_date).toLocaleDateString()}</td>
                            <td className="py-4 px-6 max-w-sm truncate">{leave.reason}</td>
                            <td className="py-4 px-6"><span className={`px-2 py-1 text-xs rounded-full ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{leave.status}</span></td>
                            <td className="py-4 px-6 text-right space-x-2">
                                {leave.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleUpdateStatus(leave.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded">Approve</button>
                                        <button onClick={() => handleUpdateStatus(leave.id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded">Reject</button>
                                    </>
                                )}
                            </td>
                        </tr>
                     ))}
                </tbody>
            </table>
        </div>
    );
};

const TeacherLeaveManager = ({ user }) => {
    const [myLeaves, setMyLeaves] = useState([]);
    const [reason, setReason] = useState('');
    const [leaveDates, setLeaveDates] = useState('');
    const [error, setError] = useState('');

    const fetchMyLeaves = useCallback(async () => {
        try {
            const response = await fetchWithAuth(`/api/leaves/teacher/${user.profileId}`);
            const data = await response.json();
            if (response.ok) setMyLeaves(data);
        } catch (err) { 
            if (err.message !== 'Authentication failed') console.error(err);
        }
    }, [user.profileId]);

    useEffect(() => { fetchMyLeaves(); }, [fetchMyLeaves]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const datesArray = leaveDates.split(',').map(d => d.trim()).filter(d => d);
        if(datesArray.length === 0) {
            setError("Please enter at least one valid date in YYYY-MM-DD format.");
            return;
        }

        try {
            const response = await fetchWithAuth('/api/leaves', {
                method: 'POST',
                body: JSON.stringify({ faculty_id: user.profileId, leave_dates: datesArray, reason }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Failed to submit leave request.');
            } else {
                fetchMyLeaves();
                setReason('');
                setLeaveDates('');
            }
        } catch (err) { 
             if (err.message !== 'Authentication failed') setError('Server connection error.');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-xl font-semibold">Apply for Leave</h3>
                <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-3 rounded-r-lg">
                    <p className="text-sm font-medium">Note: A maximum of 4 approved leaves are permitted per calendar month.</p>
                </div>
                <div>
                    <label className="text-sm text-gray-600">Leave Date(s)</label>
                    <p className="text-xs text-gray-400 mb-1">Enter dates in YYYY-MM-DD format, separated by commas.</p>
                    <input type="text" value={leaveDates} onChange={e => setLeaveDates(e.target.value)} required placeholder="e.g., 2025-10-20, 2025-10-21" className="mt-1 w-full p-2 bg-gray-100 rounded-lg border border-gray-300" />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Reason</label>
                    <textarea value={reason} onChange={e => setReason(e.target.value)} rows="4" required className="mt-1 w-full p-2 bg-gray-100 rounded-lg border border-gray-300" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">Submit Request</button>
            </form>
            <div>
                <h3 className="text-xl font-semibold mb-4">Your Leave History</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto p-1">
                    {myLeaves.length > 0 ? myLeaves.map(leave => (
                        <div key={leave.id} className="bg-white border border-gray-200 p-3 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{new Date(leave.leave_date).toDateString()}</p>
                                <p className="text-xs text-gray-500 truncate">{leave.reason}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{leave.status}</span>
                        </div>
                    )) : <p className="text-gray-400">No leave requests found.</p>}
                </div>
            </div>
        </div>
    );
};

// --- Shared Dashboard Layout for Teacher/Student ---
const DashboardLayout = ({ user, onLogout, children }) => {
    const [view, setView] = useState('schedule');

    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen">
            <header className="bg-white p-4 flex justify-between items-center shadow-sm border-b border-gray-200">
                <h1 className="text-xl font-bold text-blue-900">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</h1>
                <nav className="flex items-center space-x-4">
                    <button onClick={() => setView('schedule')} className={`px-3 py-1 rounded-md text-sm font-medium ${view === 'schedule' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Schedule</button>
                    {user.role === 'teacher' && <button onClick={() => setView('leaves')} className={`px-3 py-1 rounded-md text-sm font-medium ${view === 'leaves' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Leave Management</button>}
                    <button onClick={() => setView('notifications')} className={`px-3 py-1 rounded-md text-sm font-medium ${view === 'notifications' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Notifications</button>
                    <span className="text-sm text-gray-300">|</span>
                    <span className="text-sm text-gray-500">Welcome, {user.name}</span>
                    <button onClick={onLogout} className="text-red-600 hover:bg-red-100 px-3 py-1 rounded-md transition-colors text-sm font-medium">Logout</button>
                </nav>
            </header>
            <main className="p-8">
                {view === 'schedule' && children}
                {view === 'leaves' && <TeacherLeaveManager user={user} />}
                {view === 'notifications' && <NotificationViewer userRole={user.role} />}
            </main>
        </div>
    );
}

const TeacherDashboard = ({ user, onLogout }) => (
    <DashboardLayout user={user} onLogout={onLogout}>
        <TimetableViewer user={user} />
    </DashboardLayout>
);

const StudentDashboard = ({ user, onLogout }) => (
    <DashboardLayout user={user} onLogout={onLogout}>
        <TimetableViewer user={user} />
    </DashboardLayout>
);
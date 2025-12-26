import api from '../api';
import { BookOpen, Plus, Trash2, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const gradePoints = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
};

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: '', code: '', grade: 'B', credits: 3 });

    useEffect(() => {
        fetchCourses();
    }, []);

    const calculateGPA = () => {
        const totalPoints = courses.reduce((acc, curr) => acc + (gradePoints[curr.grade] || 0) * curr.credits, 0);
        const totalCredits = courses.reduce((acc, curr) => acc + curr.credits, 0);
        return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    };

    const fetchCourses = async () => {
        try {
            const res = await api.get('/api/courses');
            setCourses(res.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/courses', newCourse);
            setNewCourse({ name: '', code: '', grade: 'B', credits: 3 });
            setIsAdding(false);
            fetchCourses();
        } catch (error) {
            alert("Failed to add course");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/api/courses/${id}`);
            fetchCourses();
        } catch (error) {
            alert("Failed to delete course");
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

            {/* Header Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card-white" style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}><Award size={20} /></div>
                        <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Cumulative GPA</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{calculateGPA()}</div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card-white">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ background: '#ec489920', color: '#ec4899', padding: '8px', borderRadius: '8px' }}><BookOpen size={20} /></div>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Active Courses</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{courses.length}</div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="card-white">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ background: '#10b98120', color: '#10b981', padding: '8px', borderRadius: '8px' }}><TrendingUp size={20} /></div>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Credits</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{courses.reduce((acc, c) => acc + parseInt(c.credits || 0), 0)}</div>
                </motion.div>
            </div>

            {/* Course List */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>My Courses</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    <Plus size={18} /> Add Course
                </button>
            </div>

            <div className="card-white" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>COURSE NAME</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>CODE</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>CREDITS</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>GRADE</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                    No courses added yet. Click "Add Course" to get started.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course, idx) => (
                                <tr key={course.id} style={{ borderBottom: idx !== courses.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: '500' }}>{course.name}</td>
                                    <td style={{ padding: '16px 24px', color: '#64748b' }}>{course.code}</td>
                                    <td style={{ padding: '16px 24px' }}>{course.credits}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            background: course.grade.startsWith('A') ? '#dcfce7' : course.grade.startsWith('B') ? '#dbeafe' : course.grade.startsWith('C') ? '#fef9c3' : '#fee2e2',
                                            color: course.grade.startsWith('A') ? '#166534' : course.grade.startsWith('B') ? '#1e40af' : course.grade.startsWith('C') ? '#854d0e' : '#991b1b',
                                        }}>
                                            {course.grade}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <button onClick={() => handleDelete(course.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '8px' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Course Modal Overlay */}
            {isAdding && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card-white"
                        style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Add New Course</h3>
                        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>Course Name</label>
                                <input
                                    required
                                    placeholder="e.g. Intro to Psychology"
                                    value={newCourse.name}
                                    onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>Course Code</label>
                                    <input
                                        required
                                        placeholder="PSY101"
                                        value={newCourse.code}
                                        onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>Credits</label>
                                    <input
                                        type="number"
                                        required
                                        min="1" max="6"
                                        value={newCourse.credits}
                                        onChange={e => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>Current Grade</label>
                                <select
                                    value={newCourse.grade}
                                    onChange={e => setNewCourse({ ...newCourse, grade: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}
                                >
                                    {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Course</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Courses;

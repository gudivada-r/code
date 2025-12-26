import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import BookAdvisor from './BookAdvisor';
import Courses from './Courses';
import {
    LayoutDashboard, MessageSquare, Calendar, BookOpen,
    TrendingUp, User, Settings, LogOut, Search, Clock,
    Users, FileText, Heart, GraduationCap, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();
    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

    return (
        <div className="sidebar" style={{ width: '280px', flexShrink: 0 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
                <div style={{ background: '#4f46e5', padding: '8px', borderRadius: '10px' }}>
                    <GraduationCap color="white" size={24} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>Navigator</h2>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Student Success</span>
                </div>
            </div>

            {/* Nav Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => onTabChange('dashboard')}>
                    <LayoutDashboard size={20} /> Dashboard
                </div>
                <div className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => onTabChange('chat')}>
                    <MessageSquare size={20} /> AI Navigator
                </div>
                <div className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => onTabChange('schedule')}>
                    <Calendar size={20} /> Schedule
                </div>
                <div className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => onTabChange('courses')}>
                    <BookOpen size={20} /> Courses
                </div>
                <div className="nav-item"><TrendingUp size={20} /> Progress</div>
                <div className="nav-item"><Users size={20} /> Tutoring</div>
                <div className="nav-item"><Heart size={20} /> Wellness</div>
            </div>

            {/* Bottom Config */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <div className="nav-item"><Settings size={20} /> Settings</div>
                <div onClick={handleLogout} className="nav-item" style={{ color: '#ef4444' }}>
                    <LogOut size={20} /> Logout
                </div>

                {/* User Profile Micro */}
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>TU</div>
                    <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>TEST User</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Computer Science</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardHome = ({ onNavigate }) => {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero-card"
            >
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', opacity: 0.9 }}>
                        <GraduationCap size={18} /> Your Academic Success Navigator
                    </div>
                    <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1rem 0', fontWeight: '700' }}>Good afternoon, TEST User!</h1>
                    <p style={{ maxWidth: '500px', fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', lineHeight: '1.6' }}>
                        You have 3 assignments due this week and a chemistry midterm on Tuesday. I'm here to help you stay on track!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => onNavigate('chat')} style={{ border: 'none', background: 'white', color: '#4f46e5', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Start a conversation</button>
                        <button style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>View schedule</button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="stat-card-glass">
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>3.7</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Current GPA</div>
                    </div>
                    <div className="stat-card-glass">
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>87%</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>On-track score</div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <h3 className="section-title">Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {[
                    { icon: Calendar, color: '#6366f1', label: 'Book Advisor', sub: 'Schedule a meeting', action: 'schedule' },
                    { icon: BookOpen, color: '#10b981', label: 'Tutoring Center', sub: 'Get study help' },
                    { icon: FileText, color: '#f59e0b', label: 'Drop/Add Forms', sub: 'Deadline: Oct 15' },
                    { icon: Heart, color: '#ec4899', label: 'Wellness Check', sub: 'How are you feeling?' },
                    { icon: Clock, color: '#eab308', label: 'Study Timer', sub: 'Stay focused' },
                ].map((item, idx) => (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        key={idx}
                        className="card-white"
                        style={{ textAlign: 'center', cursor: 'pointer' }}
                        onClick={() => item.action && onNavigate(item.action)}
                    >
                        <div style={{ background: `${item.color}15`, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                            <item.icon color={item.color} size={24} />
                        </div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.sub}</div>
                    </motion.div>
                ))}
            </div>

            {/* AI Team */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Your AI Support Team</h3>
                <button onClick={() => onNavigate('chat')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
                    Open Chat <ChevronRight size={16} />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', paddingBottom: '2rem' }}>
                {[
                    { title: "The Tutor", role: "Course content specialist", color: "#4f46e5", icon: GraduationCap, tags: ["Explain photosynthesis", "Help with calculus", "Review my essay"] },
                    { title: "The Admin", role: "Forms & deadlines expert", color: "#10b981", icon: FileText, tags: ["Drop deadline?", "Add a course", "Transcript request"] },
                    { title: "The Coach", role: "Wellness & support guide", color: "#ec4899", icon: Heart, tags: ["Feeling stressed", "Find a club", "Mental health resouces"] },
                ].map((agent, idx) => (
                    <motion.div key={idx} className="card-white">
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ background: agent.color, padding: '12px', borderRadius: '12px', color: 'white' }}>
                                <agent.icon size={24} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{agent.title}</div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{agent.role}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Try asking:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {agent.tags.map((tag, tIdx) => (
                                <span key={tIdx} className="pill-btn">{tag}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
                {activeTab === 'dashboard' && <DashboardHome onNavigate={setActiveTab} />}

                {activeTab === 'chat' && (
                    <div style={{ height: '100%' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>AI Navigator</h2>
                        <div style={{ height: 'calc(100% - 60px)', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
                            <ChatInterface />
                        </div>
                    </div>
                )}

                {activeTab === 'schedule' && <BookAdvisor onBack={() => setActiveTab('dashboard')} />}

                {activeTab === 'courses' && <Courses />}
            </main>
        </div>
    );
};

export default Dashboard;

import React, { useState } from 'react';
import config from '../../navigator.config.json';
import './Dashboard.css'; // Assuming we'll create this or use styled-components

// Generic "Stat Card" Component
const StatCard = ({ label, value }) => (
    <div className="stat-card-glass">
        <h3>{value}</h3>
        <p>{label}</p>
    </div>
);

// Generic "Action Item" Component
const ActionItem = ({ title, type }) => (
    <div className={`action-item ${type}`}>
        <span>{title}</span>
        <button>Resolve</button>
    </div>
);

const Dashboard = () => {
    const [user] = useState({ name: "User" });

    // Interpolate welcome message
    const welcomeMessage = config.labels.hero_welcome.replace("{user}", user.name);

    return (
        <div className="dashboard-container">
            {/* Dynamic Sidebar would go here */}
            <aside className="sidebar">
                <h2>{config.app_name}</h2>
                {/* Navigation items based on features */}
            </aside>

            <main className="main-content">
                {/* Hero Section Configured by Theme */}
                <div
                    className="hero-card"
                    style={{ background: config.theme.background_gradient }}
                >
                    <h1>{welcomeMessage}</h1>

                    <div className="stats-container">
                        {/* Conditionally render Metrics based on Config */}
                        {config.features.metrics && (
                            <>
                                <StatCard label={config.labels.metric_1} value="98%" />
                                <StatCard label={config.labels.metric_2} value="4/5" />
                            </>
                        )}
                    </div>
                </div>

                {/* Dynamic Widget Grid */}
                <div className="widget-grid">
                    {config.features.action_items && (
                        <div className="widget">
                            <h3>{config.labels.action_items_title}</h3>
                            <ActionItem title="Review Quarterly Goals" type="warning" />
                            <ActionItem title="Sign Policy Update" type="critical" />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

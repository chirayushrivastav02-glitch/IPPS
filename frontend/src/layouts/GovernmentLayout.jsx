// src/layouts/GovernmentLayout.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import {
  LayoutDashboard, Target, Users, Cpu, Star, Beaker, ShoppingCart,
  CreditCard, TrendingUp, FileText, Bell, LogOut, ChevronRight,
  Settings, Menu, X
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/gov/dashboard' },
  { icon: Target, label: 'Challenges', path: '/gov/challenges', badge: '6' },
  { icon: Users, label: 'Startups', path: '/gov/startups' },
  { icon: Cpu, label: 'Matching Engine', path: '/gov/matching', badge: 'AI', badgeType: 'ai' },
  { icon: Star, label: 'Evaluation', path: '/gov/evaluation' },
  { icon: Beaker, label: 'Pilots', path: '/gov/pilots' },
  { icon: ShoppingCart, label: 'Procurement', path: '/gov/procurement' },
  { icon: CreditCard, label: 'Payments', path: '/gov/payments' },
  { icon: TrendingUp, label: 'Scale-Up', path: '/gov/scaleup' },
  { icon: FileText, label: 'Templates', path: '/gov/templates' },
  { icon: Bell, label: 'Notifications', path: '/gov/notifications' },
];

const pipelineSteps = [
  { label: 'Challenges', count: 8, path: '/gov/challenges' },
  { label: 'Applications', count: 12, path: '/gov/evaluation' },
  { label: 'Shortlisted', count: 4, path: '/gov/evaluation' },
  { label: 'Pilots', count: 4, path: '/gov/pilots' },
  { label: 'Procurement', count: 2, path: '/gov/procurement' },
  { label: 'Scaling', count: 2, path: '/gov/scaleup' },
];

export default function GovernmentLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const SidebarContent = () => (
    <>
      <div className="sidebar-logo" onClick={() => navigate('/gov/dashboard')} style={{ cursor: 'pointer' }}>
        <Logo />
      </div>

      <div className="sidebar-section-label">Navigation</div>
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, path, badge, badgeType }) => (
          <div
            key={path}
            className={`sidebar-item ${isActive(path) ? 'active' : ''}`}
            onClick={() => { navigate(path); setMobileOpen(false); }}
          >
            <Icon className="sidebar-icon" size={18} />
            <span>{label}</span>
            {badge && <span className={`sidebar-badge ${badgeType || ''}`}>{badge}</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div className="avatar" style={{ background: user.avatarColor || '#0d9488', fontSize: 13, width: 34, height: 34 }}>
              {user.avatar}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.department?.split(' ').slice(-2).join(' ')}</div>
            </div>
          </div>
        )}
        <div className="sidebar-item" onClick={handleLogout} style={{ color: 'var(--red-400)' }}>
          <LogOut size={18} className="sidebar-icon" />
          <span>Logout</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className="app-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)' }} onClick={() => setMobileOpen(false)} />
          <aside style={{
            width: 'var(--sidebar-width)',
            background: 'var(--bg-sidebar)',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--border-color)',
            position: 'absolute',
            left: 0,
          }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="app-main">
        {/* Topbar */}
        <header className="app-topbar">
          <button
            className="btn btn-icon btn-secondary"
            style={{ display: 'none' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            id="mobile-menu-btn"
          >
            <Menu size={18} />
          </button>

          {/* Pipeline Steps */}
          <div className="pipeline-bar" style={{ flex: 1, overflowX: 'auto', display: 'flex', alignItems: 'center', gap: 0, padding: 0 }}>
            {pipelineSteps.map((step, idx) => (
              <div key={step.label} className="pipeline-step">
                <button
                  className="pipeline-step-btn"
                  onClick={() => navigate(step.path)}
                >
                  <span className={`pipeline-step-count ${idx === 0 ? 'orange' : ''}`}>{step.count}</span>
                  {step.label}
                </button>
                {idx < pipelineSteps.length - 1 && (
                  <ChevronRight size={14} className="pipeline-arrow" />
                )}
              </div>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--teal-400)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal-400)', display: 'inline-block', boxShadow: '0 0 8px var(--teal-400)' }} />
              Transparent · Rule-based · Auditable
            </div>

            <div style={{ position: 'relative' }}>
              <button className="btn btn-icon btn-secondary">
                <Bell size={17} />
              </button>
              <div className="notif-dot" />
            </div>

            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="avatar" style={{ background: user.avatarColor || '#0d9488' }}>{user.avatar}</div>
                <div style={{ display: 'none' }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.department}</div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="app-content page-enter">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

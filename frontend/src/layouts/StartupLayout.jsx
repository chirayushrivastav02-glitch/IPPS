// src/layouts/StartupLayout.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import {
  LayoutDashboard, Store, Star, FileText, Cpu, Beaker, FileSignature,
  CreditCard, TrendingUp, User, FolderOpen, Bell, LogOut, ChevronRight, Menu, HandHeart
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/startup/dashboard' },
  { icon: Store, label: 'Challenge Marketplace', path: '/startup/marketplace' },
  { icon: Star, label: 'Recommended', path: '/startup/recommended' },
  { icon: HandHeart, label: 'Expert Network', path: '/startup/experts', badge: 'New', badgeType: 'ai' },
  { icon: FileText, label: 'My Applications', path: '/startup/applications' },
  { icon: Cpu, label: 'Matching Engine', path: '/startup/matching', badge: 'AI', badgeType: 'ai' },
  { icon: Beaker, label: 'Pilots', path: '/startup/pilots' },
  { icon: FileSignature, label: 'Contracts', path: '/startup/contracts' },
  { icon: CreditCard, label: 'Payments', path: '/startup/payments' },
  { icon: TrendingUp, label: 'Scale-up', path: '/startup/scaleup' },
  { icon: User, label: 'Company Profile', path: '/startup/profile' },
  { icon: FolderOpen, label: 'Documents', path: '/startup/documents' },
  { icon: Bell, label: 'Notifications', path: '/startup/notifications' },
];

export default function StartupLayout({ children }) {
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
      <div className="sidebar-logo" onClick={() => navigate('/startup/dashboard')} style={{ cursor: 'pointer' }}>
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
            <div className="avatar" style={{ background: user.avatarColor || '#6366f1', fontSize: 13, width: 34, height: 34 }}>
              {user.avatar}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.company}</div>
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
      <aside className="app-sidebar">
        <SidebarContent />
      </aside>

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
        <header className="app-topbar">
          <button className="btn btn-icon btn-secondary" id="mobile-menu-btn-su" style={{ display: 'none' }} onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--indigo-400)', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
              DPIIT Recognised
            </span>
            <span style={{ background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.25)', color: 'var(--teal-400)', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
              GeM Ready
            </span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <button className="btn btn-icon btn-secondary"><Bell size={17} /></button>
              <div className="notif-dot" />
            </div>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="avatar" style={{ background: user.avatarColor || '#6366f1' }}>{user.avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.company}</div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="app-content page-enter">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn-su { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

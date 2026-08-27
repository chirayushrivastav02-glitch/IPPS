// src/pages/ComingSoon.jsx
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

export default function ComingSoon({ title = 'Module', backTo = '/' }) {
  const navigate = useNavigate();
  return (
    <div className="page-enter" data-testid="coming-soon-page">
      <div className="section-header">
        <div>
          <h1 className="section-title" data-testid="coming-soon-title">{title}</h1>
          <p className="section-subtitle">This module is part of the IPPS Setu roadmap</p>
        </div>
      </div>
      <div className="empty-state">
        <div className="empty-state-icon"><Construction size={40} style={{ color: 'var(--amber-300)' }} /></div>
        <div className="empty-state-title">{title} — coming soon</div>
        <p style={{ marginBottom: 16 }}>
          The lifecycle stage is designed and reachable, and its screens land in the next phase.
        </p>
        <button className="btn btn-secondary" onClick={() => navigate(backTo)} data-testid="coming-soon-back-button">
          <ArrowLeft size={15} /> Back to dashboard
        </button>
      </div>
    </div>
  );
}

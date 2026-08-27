// src/pages/startup/ApplicationsPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockApplications, mockChallenges } from '../../data/mockData';
import { Store, ChevronRight } from 'lucide-react';

const MY_STARTUP_ID = 'ST-003';

const stages = ['Submitted', 'Screening', 'Evaluation', 'Shortlisted', 'Pilot'];

const badgeFor = {
  Submitted: 'badge-submitted',
  Screening: 'badge-screening',
  Evaluation: 'badge-evaluation',
  Shortlisted: 'badge-shortlisted',
  Pilot: 'badge-pilot',
  Rejected: 'badge-rejected',
};

const titleFor = (challengeId) => mockChallenges.find(c => c.id === challengeId)?.title || challengeId;

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const { proposals } = useApp();
  const [statusFilter, setStatusFilter] = useState('');

  const all = [...proposals, ...mockApplications.filter(a => a.startupId === MY_STARTUP_ID)];
  const rows = all.filter(a => !statusFilter || a.status === statusFilter);

  return (
    <div className="page-enter" data-testid="applications-page">
      <div className="section-header">
        <div>
          <h1 className="section-title" data-testid="applications-title">My Applications</h1>
          <p className="section-subtitle">Track every proposal through screening, evaluation, pilot and procurement</p>
        </div>
        <div className="section-actions">
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} data-testid="applications-status-filter">
            <option value="">All Statuses</option>
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => navigate('/startup/marketplace')} data-testid="applications-browse-button">
            <Store size={16} /> Browse Challenges
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: all.length, color: 'var(--text-primary)' },
          { label: 'In Evaluation', value: all.filter(a => a.status === 'Evaluation').length, color: 'var(--amber-300)' },
          { label: 'Shortlisted', value: all.filter(a => a.status === 'Shortlisted').length, color: 'var(--green-400)' },
          { label: 'Submitted', value: all.filter(a => a.status === 'Submitted').length, color: 'var(--blue-400)' },
        ].map(s => (
          <div
            key={s.label}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)', padding: '8px 16px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            data-testid={`applications-stat-${s.label.toLowerCase().replace(/\s/g, '-')}`}
          >
            <span style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="empty-state" data-testid="applications-empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title">No applications yet</div>
          <p style={{ marginBottom: 16 }}>Browse the marketplace and submit your first proposal.</p>
          <button className="btn btn-primary" onClick={() => navigate('/startup/marketplace')} data-testid="applications-empty-browse-button">
            Browse Challenges
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} data-testid="applications-list">
          {rows.map(a => {
            const stageIdx = Math.max(0, stages.indexOf(a.status));
            return (
              <div className="card" key={a.id} data-testid={`application-card-${a.id}`}>
                <div className="challenge-card-header">
                  <div>
                    <code style={{ fontSize: 11.5, color: 'var(--teal-400)' }}>{a.id}</code>
                    <div className="challenge-card-title" style={{ marginTop: 4 }}>{titleFor(a.challengeId)}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                      Challenge {a.challengeId} · submitted {a.submittedDate}
                    </div>
                  </div>
                  <span className={`badge ${badgeFor[a.status] || ''}`} data-testid={`application-status-${a.id}`}>{a.status}</span>
                </div>

                {/* Progress timeline */}
                <div className="process-timeline" style={{ marginTop: 14 }}>
                  {stages.map((s, i) => (
                    <div className="timeline-step" key={s}>
                      <div className={`timeline-dot ${i < stageIdx ? 'completed' : i === stageIdx ? 'active' : 'pending'}`} />
                      <div className={`timeline-label ${i < stageIdx ? 'completed' : i === stageIdx ? 'active' : ''}`}>{s}</div>
                      {i < stages.length - 1 && <div className={`timeline-connector ${i < stageIdx ? 'completed' : ''}`} />}
                    </div>
                  ))}
                </div>

                {a.overallScore != null && (
                  <div style={{ marginTop: 14 }}>
                    <div className="card-title" style={{ marginBottom: 6 }}>Evaluation Score</div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill green" style={{ width: `${a.overallScore}%` }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{a.overallScore} / 100</div>
                  </div>
                )}

                {a.proposedSolution && (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 14 }}>
                    {a.proposedSolution.slice(0, 180)}{a.proposedSolution.length > 180 ? '…' : ''}
                  </p>
                )}

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
                  {a.pilotBudget && <span className="challenge-meta-item">💰 {a.pilotBudget}</span>}
                  {a.pilotDuration && <span className="challenge-meta-item">⏱ {a.pilotDuration}</span>}
                  {a.teamLead && <span className="challenge-meta-item">👤 {a.teamLead}</span>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => navigate(`/startup/marketplace/${a.challengeId}`)}
                    data-testid={`application-view-challenge-${a.id}`}
                  >
                    View Challenge <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

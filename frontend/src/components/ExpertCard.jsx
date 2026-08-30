// src/components/ExpertCard.jsx
import { useNavigate } from 'react-router-dom';
import { Sparkles, Building2, Briefcase, ChevronRight, HandHeart } from 'lucide-react';

export default function ExpertCard({ expert, onRequest, requestStatus }) {
  const navigate = useNavigate();
  const score = expert.computedScore ?? expert.matchScore;

  return (
    <div className="card" data-testid={`expert-card-${expert.id}`}>
      <div className="challenge-card-header">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div className={`match-score ${score >= 90 ? 'high' : 'medium'}`} data-testid={`expert-score-${expert.id}`}>
            {score}%
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div className="challenge-card-title" data-testid={`expert-name-${expert.id}`}>{expert.name}</div>
              <span className="badge badge-pilot" title="Fictional profile for demonstration only">Demo Expert</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>{expert.role}</div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Building2 size={12} /> {expert.company}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Briefcase size={12} /> {expert.experience}</span>
            </div>
          </div>
        </div>
        {requestStatus && (
          <span
            className={`badge ${requestStatus === 'Completed' ? 'badge-completed' : requestStatus === 'Scheduled' ? 'badge-active' : 'badge-submitted'}`}
            data-testid={`expert-request-status-${expert.id}`}
          >
            {requestStatus}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        {expert.expertise.map(t => <span key={t} className="tag">{t}</span>)}
      </div>

      <div className="info-banner" style={{ marginTop: 14 }}>
        <Sparkles size={14} style={{ color: 'var(--orange-500)', flexShrink: 0 }} />
        <span data-testid={`expert-explanation-${expert.id}`}>
          <strong style={{ color: 'var(--teal-600)' }}>{score}% Match</strong> — {expert.explanation || expert.matchReason}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Mentorship type</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }} data-testid={`expert-mentorship-${expert.id}`}>{expert.mentorship}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => navigate(`/startup/experts/${expert.id}`)}
            data-testid={`expert-view-profile-${expert.id}`}
          >
            View Profile <ChevronRight size={13} />
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onRequest(expert)}
            disabled={!!requestStatus}
            data-testid={`expert-request-button-${expert.id}`}
          >
            <HandHeart size={13} /> {requestStatus ? 'Requested' : 'Request Mentorship'}
          </button>
        </div>
      </div>
    </div>
  );
}

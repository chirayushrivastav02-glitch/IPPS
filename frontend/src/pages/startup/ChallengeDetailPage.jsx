// src/pages/startup/ChallengeDetailPage.jsx
// Shared by the startup marketplace and the government challenge view (portal prop).
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { challengesAPI } from '../../services/api';
import { mockApplications, mockMatchingData } from '../../data/mockData';
import { ArrowLeft, Send, Edit, Users } from 'lucide-react';

const statusColors = {
  Draft: 'badge-draft',
  Published: 'badge-published',
  Evaluation: 'badge-evaluation',
  Pilot: 'badge-pilot',
  Procurement: 'badge-procurement',
  Completed: 'badge-completed',
};

const sections = [
  ['Problem Statement', 'problem'],
  ['Current Situation', 'currentSituation'],
  ['Expected Solution', 'expectedSolution'],
  ['Functional Requirements', 'functionalRequirements'],
  ['Technical Requirements', 'technicalRequirements'],
  ['Deliverables', 'deliverables'],
  ['Success Metrics', 'successMetrics'],
];

export default function ChallengeDetailPage({ portal = 'startup' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    let alive = true;
    setChallenge(null);
    setError(null);
    challengesAPI.getById(id)
      .then(c => { if (alive) setChallenge(c); })
      .catch(() => { if (alive) setError('Challenge not found or unavailable.'); });
    return () => { alive = false; };
  }, [id]);

  const match = mockMatchingData.find(m => m.challengeId === id);
  const applications = mockApplications.filter(a => a.challengeId === id);
  const backTo = portal === 'gov' ? '/gov/challenges' : '/startup/marketplace';

  return (
    <div className="page-enter" data-testid="challenge-detail-page">
      <button
        className="btn btn-sm btn-secondary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate(backTo)}
        data-testid="challenge-detail-back-button"
      >
        <ArrowLeft size={14} /> Back
      </button>

      {error && (
        <div className="empty-state" data-testid="challenge-detail-error">
          <div className="empty-state-icon">⚠</div>
          <div className="empty-state-title">{error}</div>
        </div>
      )}

      {!challenge && !error && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }} data-testid="challenge-detail-loading">Loading challenge…</p>
      )}

      {challenge && (
        <>
          <div className="section-header">
            <div>
              <code style={{ fontSize: 12, color: 'var(--teal-400)' }} data-testid="challenge-detail-id">{challenge.id}</code>
              <h1 className="section-title" style={{ marginTop: 4 }} data-testid="challenge-detail-title">{challenge.title}</h1>
              <p className="section-subtitle">{challenge.department} · {challenge.location}</p>
            </div>
            <div className="section-actions">
              <span className={`badge ${statusColors[challenge.status] || ''}`} data-testid="challenge-detail-status">{challenge.status}</span>
              {portal === 'startup' ? (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/startup/marketplace/${challenge.id}/apply`)}
                  data-testid="challenge-detail-apply-button"
                >
                  <Send size={16} /> Submit Proposal
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/gov/challenges/${challenge.id}/edit`)}
                    data-testid="challenge-detail-edit-button"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/gov/evaluation?challenge=${challenge.id}`)}
                    data-testid="challenge-detail-evaluate-button"
                  >
                    <Users size={16} /> Applications ({challenge.applications})
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="kpi-grid" style={{ marginBottom: 20 }}>
            {[
              { k: 'budget', label: 'Indicative Budget', value: challenge.budget, cls: 'teal' },
              { k: 'timeline', label: 'Timeline', value: challenge.timeline, cls: 'blue' },
              { k: 'pilot', label: 'Pilot Duration', value: challenge.pilotDuration, cls: 'purple' },
              { k: 'deadline', label: 'Application Deadline', value: challenge.deadline || 'TBD', cls: 'amber' },
            ].map(s => (
              <div key={s.k} className={`kpi-card ${s.cls}`} data-testid={`challenge-detail-kpi-${s.k}`}>
                <div className="card-header"><span className="card-title">{s.label}</span></div>
                <div className="card-value" style={{ fontSize: 20 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="tabs">
            {['overview', 'requirements', 'eligibility', portal === 'gov' ? 'applications' : 'match'].map(t => (
              <button
                key={t}
                className={`tab-btn ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}
                data-testid={`challenge-detail-tab-${t}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="card" data-testid="challenge-detail-overview">
              {sections.slice(0, 3).map(([label, key]) => (
                <div key={key} style={{ marginBottom: 18 }}>
                  <div className="card-title" style={{ marginBottom: 6 }}>{label}</div>
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{challenge[key] || '—'}</p>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="tag teal">{challenge.sector}</span>
                {(challenge.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          )}

          {tab === 'requirements' && (
            <div className="card" data-testid="challenge-detail-requirements">
              {sections.slice(3).map(([label, key]) => (
                <div key={key} style={{ marginBottom: 18 }}>
                  <div className="card-title" style={{ marginBottom: 6 }}>{label}</div>
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{challenge[key] || '—'}</p>
                </div>
              ))}
              <div className="divider" />
              <div className="card-title" style={{ marginBottom: 6 }}>Procurement Pathway</div>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{challenge.procurementPathway}</p>
            </div>
          )}

          {tab === 'eligibility' && (
            <div className="card" data-testid="challenge-detail-eligibility">
              {challenge.eligibility ? (
                Object.entries(challenge.eligibility).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 14 }}>
                    <div className="card-title" style={{ marginBottom: 4, textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</div>
                    <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{v}</p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  Open to DPIIT recognised startups and MSMEs with relevant sector experience.
                </p>
              )}
              <div className="divider" />
              <div className="card-title" style={{ marginBottom: 8 }}>Evaluation Weightage</div>
              {Object.entries(challenge.evaluationCriteria || {}).map(([k, v]) => (
                <div key={k} className="score-bar-row">
                  <span className="score-bar-label" style={{ textTransform: 'capitalize' }}>{k}</span>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-bar-fill teal" style={{ width: `${v * 2.5}%` }} />
                  </div>
                  <span className="score-bar-value">{v}%</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'match' && (
            <div className="card" data-testid="challenge-detail-match">
              {match ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div className={`match-score ${match.overallScore >= 90 ? 'high' : 'medium'}`}>{match.overallScore}%</div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>AI Match Score</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{match.startupName}</div>
                    </div>
                  </div>
                  {Object.entries(match.breakdown).map(([k, v]) => (
                    <div key={k} className="score-bar-row">
                      <span className="score-bar-label" style={{ textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-bar-fill green" style={{ width: `${v}%` }} />
                      </div>
                      <span className="score-bar-value">{v}</span>
                    </div>
                  ))}
                </>
              ) : (
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  No AI match computed for this challenge yet. Submit a proposal to trigger matching.
                </p>
              )}
            </div>
          )}

          {tab === 'applications' && (
            <div className="table-wrapper" data-testid="challenge-detail-applications">
              <table className="table">
                <thead>
                  <tr><th>Application</th><th>Startup</th><th>Submitted</th><th>Score</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {applications.map(a => (
                    <tr key={a.id}>
                      <td><code style={{ fontSize: 12, color: 'var(--teal-400)' }}>{a.id}</code></td>
                      <td style={{ fontWeight: 600 }}>{a.startupName}</td>
                      <td>{a.submittedDate}</td>
                      <td style={{ fontWeight: 700, color: 'var(--teal-400)' }}>{a.overallScore ?? '—'}</td>
                      <td><span className="badge">{a.status}</span></td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr><td colSpan={5} style={{ color: 'var(--text-muted)' }}>No applications received yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

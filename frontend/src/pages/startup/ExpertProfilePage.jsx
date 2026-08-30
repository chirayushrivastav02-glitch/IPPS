// src/pages/startup/ExpertProfilePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { expertsAPI } from '../../services/api';
import { mockChallenges } from '../../data/mockData';
import { rankExpertsForChallenge } from '../../lib/expertMatching';
import { ArrowLeft, Building2, Briefcase, HandHeart, ChevronRight, Sparkles } from 'lucide-react';

export default function ExpertProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mentorships } = useApp();
  const [expert, setExpert] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setExpert(null);
    setError(null);
    expertsAPI.getById(id)
      .then(e => { if (alive) setExpert(e); })
      .catch(() => { if (alive) setError('Expert profile not found.'); });
    return () => { alive = false; };
  }, [id]);

  // Recommended projects = challenges where this expert ranks highly.
  const recommendedProjects = expert
    ? mockChallenges
        .map(c => {
          const ranked = rankExpertsForChallenge(c, [expert])[0];
          return { challenge: c, score: ranked.computedScore, explanation: ranked.explanation };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
    : [];

  const existing = mentorships.filter(m => m.expertId === id);

  return (
    <div className="page-enter" data-testid="expert-profile-page">
      <button
        className="btn btn-sm btn-secondary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate('/startup/experts')}
        data-testid="expert-profile-back-button"
      >
        <ArrowLeft size={14} /> Back to Expert Network
      </button>

      {error && (
        <div className="empty-state" data-testid="expert-profile-error">
          <div className="empty-state-icon">⚠</div>
          <div className="empty-state-title">{error}</div>
        </div>
      )}
      {!expert && !error && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }} data-testid="expert-profile-loading">Loading expert profile…</p>
      )}

      {expert && (
        <>
          <div className="section-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 className="section-title" data-testid="expert-profile-name">{expert.name}</h1>
                <span className="badge badge-pilot" title="Fictional profile for demonstration only" data-testid="expert-profile-demo-badge">
                  Demo Expert
                </span>
              </div>
              <p className="section-subtitle">{expert.role}</p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 6, fontSize: 12.5, color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Building2 size={13} /> {expert.company}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Briefcase size={13} /> {expert.experience} experience</span>
              </div>
            </div>
            <div className="section-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/startup/experts')}
                data-testid="expert-profile-request-button"
              >
                <HandHeart size={16} /> Request Mentorship
              </button>
            </div>
          </div>

          <div className="kpi-grid" style={{ marginBottom: 20 }}>
            <div className="kpi-card teal" data-testid="expert-profile-kpi-score">
              <div className="card-header"><span className="card-title">Baseline Match Score</span></div>
              <div className="card-value">{expert.matchScore}%</div>
              <div className="card-sub">across mapped challenges</div>
            </div>
            <div className="kpi-card purple" data-testid="expert-profile-kpi-mentorship">
              <div className="card-header"><span className="card-title">Mentorship Type</span></div>
              <div className="card-value" style={{ fontSize: 18 }}>{expert.mentorship}</div>
            </div>
            <div className="kpi-card green" data-testid="expert-profile-kpi-sectors">
              <div className="card-header"><span className="card-title">Sectors Covered</span></div>
              <div className="card-value">{expert.sectors.length}</div>
              <div className="card-sub">{expert.sectors[0]} + more</div>
            </div>
            <div className="kpi-card amber" data-testid="expert-profile-kpi-sessions">
              <div className="card-header"><span className="card-title">Your Sessions</span></div>
              <div className="card-value">{existing.length}</div>
              <div className="card-sub">{existing.filter(m => m.status === 'Completed').length} completed</div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card" data-testid="expert-profile-expertise-card">
              <div className="card-header"><span className="card-title">Expertise</span></div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {expert.expertise.map(t => <span key={t} className="tag teal">{t}</span>)}
              </div>
              <div className="divider" />
              <div className="card-title" style={{ marginBottom: 8 }}>Sectors</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {expert.sectors.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
              <div className="divider" />
              <div className="card-title" style={{ marginBottom: 6 }}>Why startups work with {expert.name.split(' ')[0]}</div>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{expert.matchReason}.</p>
              <div className="info-banner" style={{ marginTop: 14 }}>
                <Sparkles size={14} style={{ color: 'var(--orange-500)', flexShrink: 0 }} />
                <span>Fictional demo profile — used to showcase matching and mentorship tracking, not an actual platform partner.</span>
              </div>
            </div>

            <div className="card" data-testid="expert-profile-projects-card">
              <div className="card-header"><span className="card-title">Recommended Projects</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                {recommendedProjects.map(({ challenge, score, explanation }) => (
                  <div
                    key={challenge.id}
                    onClick={() => navigate(`/startup/experts?challenge=${challenge.id}`)}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer',
                      padding: '12px 14px', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)', background: 'var(--surface-alt)',
                    }}
                    data-testid={`expert-profile-project-${challenge.id}`}
                  >
                    <div className={`match-score ${score >= 90 ? 'high' : 'medium'}`}>{score}%</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{challenge.title}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                        <code style={{ color: 'var(--teal-600)' }}>{challenge.id}</code> · {challenge.sector}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{explanation}</div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

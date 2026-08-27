// src/pages/startup/MarketplacePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { challengesAPI } from '../../services/api';
import { sectors, mockMatchingData } from '../../data/mockData';
import { Search, ChevronRight, Send } from 'lucide-react';

const statusColors = {
  Draft: 'badge-draft',
  Published: 'badge-published',
  Evaluation: 'badge-evaluation',
  Pilot: 'badge-pilot',
  Procurement: 'badge-procurement',
  Completed: 'badge-completed',
};

const matchFor = (id) => mockMatchingData.find(m => m.challengeId === id)?.overallScore ?? null;

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    let alive = true;
    challengesAPI.getAll({})
      .then(c => { if (alive) { setChallenges(c); setLoading(false); } })
      .catch(() => { if (alive) { setFailed(true); setLoading(false); } });
    return () => { alive = false; };
  }, []);

  const filtered = challenges.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.department.toLowerCase().includes(q) || c.problem.toLowerCase().includes(q);
    return matchSearch && (!sectorFilter || c.sector === sectorFilter) && (!statusFilter || c.status === statusFilter);
  });

  return (
    <div className="page-enter" data-testid="marketplace-page">
      <div className="section-header">
        <div>
          <h1 className="section-title" data-testid="marketplace-title">Challenge Marketplace</h1>
          <p className="section-subtitle">Browse government innovation challenges and submit your solution</p>
        </div>
      </div>

      <div className="filter-row" style={{ marginBottom: 20 }}>
        <div className="search-bar">
          <Search size={15} />
          <input
            placeholder="Search challenges, ministries, problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            data-testid="marketplace-search-input"
          />
        </div>
        <select className="filter-select" value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} data-testid="marketplace-sector-filter">
          <option value="">All Sectors</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} data-testid="marketplace-status-filter">
          <option value="">All Statuses</option>
          {['Published', 'Evaluation', 'Pilot', 'Procurement', 'Draft'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading && <p style={{ fontSize: 13, color: 'var(--text-muted)' }} data-testid="marketplace-loading">Loading challenges…</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }} data-testid="marketplace-challenge-grid">
        {filtered.map(c => {
          const score = matchFor(c.id);
          return (
            <div
              key={c.id}
              className="challenge-card"
              onClick={() => navigate(`/startup/marketplace/${c.id}`)}
              data-testid={`marketplace-challenge-card-${c.id}`}
            >
              <div className="challenge-card-header">
                <div>
                  <code style={{ fontSize: 11, color: 'var(--teal-400)' }}>{c.id}</code>
                  <div className="challenge-card-title" style={{ marginTop: 4 }}>{c.title}</div>
                </div>
                <span className={`badge ${statusColors[c.status] || ''}`}>{c.status}</span>
              </div>

              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {c.problem.slice(0, 110)}…
              </div>

              <div className="challenge-card-meta">
                <span className="challenge-meta-item">🏛️ {c.department}</span>
                <span className="challenge-meta-item">💰 {c.budget}</span>
                <span className="challenge-meta-item">📅 {c.deadline || 'TBD'}</span>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="tag teal">{c.sector}</span>
                {c.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                {score !== null ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className={`match-score ${score >= 90 ? 'high' : 'medium'}`}>{score}%</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI match</span>
                  </div>
                ) : <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.applications} applications</span>}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={e => { e.stopPropagation(); navigate(`/startup/marketplace/${c.id}`); }}
                    data-testid={`marketplace-view-button-${c.id}`}
                  >
                    View <ChevronRight size={13} />
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={e => { e.stopPropagation(); navigate(`/startup/marketplace/${c.id}/apply`); }}
                    data-testid={`marketplace-apply-button-${c.id}`}
                  >
                    <Send size={13} /> Apply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="empty-state" data-testid="marketplace-empty-state">
          <div className="empty-state-icon">🎯</div>
          <div className="empty-state-title">
            {failed ? 'Challenge feed unavailable' : 'No challenges match your filters'}
          </div>
          <p style={{ marginBottom: 16 }}>
            {failed ? 'Reconnect to load live challenges.' : 'Try widening your search.'}
          </p>
          {!failed && (
            <button
              className="btn btn-primary"
              onClick={() => { setSearch(''); setSectorFilter(''); setStatusFilter(''); }}
              data-testid="marketplace-clear-filters-button"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

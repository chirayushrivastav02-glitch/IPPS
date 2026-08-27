// src/pages/startup/SubmitProposalPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { applicationsAPI, challengesAPI } from '../../services/api';
import { ArrowLeft, Send, Loader2, Check } from 'lucide-react';

const MY_STARTUP_ID = 'ST-003';

const steps = ['Solution', 'Pilot Plan', 'Team & Review'];

export default function SubmitProposalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showNotification, addProposal } = useApp();

  const [challenge, setChallenge] = useState(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    proposedSolution: '',
    technology: '',
    pilotBudget: '',
    pilotDuration: '6 months',
    pilotScope: '',
    teamLead: '',
    totalTeam: '',
    previousGovtWork: '',
    consent: false,
  });

  useEffect(() => {
    let alive = true;
    challengesAPI.getById(id).then(c => { if (alive) setChallenge(c); }).catch(() => {});
    return () => { alive = false; };
  }, [id]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const stepValid = () => {
    if (step === 0) return form.proposedSolution.trim().length >= 20 && form.technology.trim().length > 0;
    if (step === 1) return form.pilotBudget.trim() && form.pilotScope.trim();
    return form.teamLead.trim() && form.consent;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stepValid()) {
      showNotification('Please complete the required fields before submitting.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await applicationsAPI.submit({
        challengeId: id,
        startupId: MY_STARTUP_ID,
        startupName: user?.company || 'NovaTech Solutions',
        ...form,
      });
      addProposal(res.application);
      showNotification(`Proposal ${res.application.id} submitted successfully`, 'success');
      navigate('/startup/applications');
    } catch {
      showNotification('Submission failed. Please retry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter" data-testid="submit-proposal-page">
      <button
        className="btn btn-sm btn-secondary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate(`/startup/marketplace/${id}`)}
        data-testid="submit-proposal-back-button"
      >
        <ArrowLeft size={14} /> Back to challenge
      </button>

      <div className="section-header">
        <div>
          <h1 className="section-title" data-testid="submit-proposal-title">Submit Proposal</h1>
          <p className="section-subtitle">
            <code style={{ color: 'var(--teal-400)' }}>{id}</code>
            {challenge ? ` — ${challenge.title}` : ''}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper" data-testid="submit-proposal-stepper">
        {steps.map((label, i) => (
          <div className="stepper-item" key={label}>
            <div className={`stepper-dot ${i < step ? 'done' : i === step ? 'current' : 'future'}`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <div className={`stepper-label ${i === step ? 'current' : i < step ? 'done' : ''}`}>{label}</div>
            {i < steps.length - 1 && <div className={`stepper-line ${i < step ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginTop: 20 }}>
        {step === 0 && (
          <div data-testid="submit-proposal-step-solution">
            <div className="form-group">
              <label className="form-label">Proposed Solution *</label>
              <textarea
                className="form-textarea"
                rows={6}
                placeholder="Describe your solution, architecture and how it addresses the problem statement (min 20 characters)"
                value={form.proposedSolution}
                onChange={set('proposedSolution')}
                data-testid="proposal-solution-input"
              />
              <div className="form-hint">{form.proposedSolution.length} characters</div>
            </div>
            <div className="form-group">
              <label className="form-label">Technology Stack *</label>
              <input
                className="form-input"
                placeholder="e.g. IoT sensors, Edge AI, FHIR APIs, React Native"
                value={form.technology}
                onChange={set('technology')}
                data-testid="proposal-technology-input"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div data-testid="submit-proposal-step-pilot">
            <div className="form-row cols-2">
              <div className="form-group">
                <label className="form-label">Proposed Pilot Budget *</label>
                <input
                  className="form-input"
                  placeholder="e.g. ₹85 Lakhs"
                  value={form.pilotBudget}
                  onChange={set('pilotBudget')}
                  data-testid="proposal-budget-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pilot Duration</label>
                <select className="form-select" value={form.pilotDuration} onChange={set('pilotDuration')} data-testid="proposal-duration-select">
                  {['3 months', '6 months', '9 months', '12 months'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Pilot Scope & Locations *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="e.g. Delhi (15 water bodies), Bengaluru (10 water bodies)"
                value={form.pilotScope}
                onChange={set('pilotScope')}
                data-testid="proposal-scope-input"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div data-testid="submit-proposal-step-team">
            <div className="form-row cols-2">
              <div className="form-group">
                <label className="form-label">Project Lead *</label>
                <input
                  className="form-input"
                  placeholder="Name, designation"
                  value={form.teamLead}
                  onChange={set('teamLead')}
                  data-testid="proposal-team-lead-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Team Assigned</label>
                <input
                  className="form-input"
                  placeholder="e.g. 8 members"
                  value={form.totalTeam}
                  onChange={set('totalTeam')}
                  data-testid="proposal-team-size-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Previous Government Work</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Past government deployments, or 'first government project'"
                value={form.previousGovtWork}
                onChange={set('previousGovtWork')}
                data-testid="proposal-govt-work-input"
              />
            </div>
            <div className="info-banner" style={{ marginBottom: 16 }}>
              <span>Submitting locks your proposal for departmental screening and AI matching.</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
                data-testid="proposal-consent-checkbox"
              />
              I confirm the information is accurate and accept the platform terms.
            </label>
          </div>
        )}

        <div className="divider" />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={step === 0}
            onClick={() => setStep(s => Math.max(0, s - 1))}
            data-testid="proposal-prev-button"
          >
            Previous
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (!stepValid()) { showNotification('Complete the required fields to continue.', 'error'); return; }
                setStep(s => s + 1);
              }}
              data-testid="proposal-next-button"
            >
              Continue
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={submitting} data-testid="proposal-submit-button">
              {submitting ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : <><Send size={15} /> Submit Proposal</>}
            </button>
          )}
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

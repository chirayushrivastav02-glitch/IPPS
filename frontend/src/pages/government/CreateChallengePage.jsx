// src/pages/government/CreateChallengePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { challengesAPI } from '../../services/api';
import { sectors, departments } from '../../data/mockData';
import { Save, Eye, Globe, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Problem', desc: 'Problem statement & context' },
  { id: 2, label: 'Solution', desc: 'Expected solution & requirements' },
  { id: 3, label: 'Procurement', desc: 'Budget, timeline & pathway' },
  { id: 4, label: 'Eligibility', desc: 'Startup requirements' },
  { id: 5, label: 'Evaluation', desc: 'Scoring criteria' },
];

export default function CreateChallengePage() {
  const navigate = useNavigate();
  const { showNotification } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', department: '', sector: '', problem: '', currentSituation: '', problemImpact: '',
    expectedSolution: '', functionalRequirements: '', technicalRequirements: '', deliverables: '', successMetrics: '',
    budget: '', timeline: '', pilotDuration: '', geographicScope: '', procurementPathway: '',
    startupRequirements: '', experience: '', techRequirements: '', financialRequirements: '', certifications: '',
    technical: 30, innovation: 25, scalability: 20, team: 10, financial: 10, cost: 5,
  });

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async (status = 'Draft') => {
    setSaving(true);
    try {
      await challengesAPI.create({ ...form, status });
      showNotification(status === 'Draft' ? 'Challenge saved as draft!' : 'Challenge published successfully!');
      navigate('/gov/challenges');
    } finally {
      setSaving(false);
    }
  };

  const totalCriteria = form.technical + form.innovation + form.scalability + form.team + form.financial + form.cost;

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">Create Challenge</h1>
          <p className="section-subtitle">Define a new government innovation challenge</p>
        </div>
        <div className="section-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/gov/challenges')}>Cancel</button>
          <button className="btn btn-secondary" onClick={() => handleSave('Draft')} disabled={saving}>
            <Save size={15} /> Save Draft
          </button>
          <button className="btn btn-primary" onClick={() => handleSave('Published')} disabled={saving}>
            <Globe size={15} /> Publish Challenge
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper" style={{ marginBottom: 32 }}>
        {steps.map((step, idx) => (
          <div key={step.id} className="stepper-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                className={`stepper-dot ${currentStep > step.id ? 'done' : currentStep === step.id ? 'current' : 'future'}`}
                onClick={() => setCurrentStep(step.id)}
                style={{ cursor: 'pointer' }}
              >
                {currentStep > step.id ? <Check size={14} /> : step.id}
              </div>
              <div className={`stepper-label ${currentStep === step.id ? 'current' : currentStep > step.id ? 'done' : ''}`}>
                {step.label}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`stepper-line ${currentStep > step.id ? 'done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 800 }}>
        {/* Step 1: Problem */}
        {currentStep === 1 && (
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Problem Statement</h3>

            <div className="form-group">
              <label className="form-label">Challenge Title <span className="required">*</span></label>
              <input
                className="form-input"
                placeholder="e.g., AI-Powered Water Quality Monitoring for Urban Water Bodies"
                value={form.title}
                onChange={e => update('title', e.target.value)}
              />
            </div>

            <div className="form-row cols-2">
              <div className="form-group">
                <label className="form-label">Department / Ministry <span className="required">*</span></label>
                <select className="form-select" value={form.department} onChange={e => update('department', e.target.value)}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Sector <span className="required">*</span></label>
                <select className="form-select" value={form.sector} onChange={e => update('sector', e.target.value)}>
                  <option value="">Select Sector</option>
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Problem Statement <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="Describe the problem that needs to be solved in detail. What is the challenge?"
                value={form.problem}
                onChange={e => update('problem', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Situation <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="Describe the current state, scale of the problem, and why existing solutions are inadequate."
                value={form.currentSituation}
                onChange={e => update('currentSituation', e.target.value)}
                style={{ minHeight: 90 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Problem Impact</label>
              <textarea
                className="form-textarea"
                placeholder="What is the scale and impact of this problem? Number of citizens affected, economic cost, etc."
                value={form.problemImpact}
                onChange={e => update('problemImpact', e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>
          </div>
        )}

        {/* Step 2: Solution */}
        {currentStep === 2 && (
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Expected Solution</h3>

            <div className="form-group">
              <label className="form-label">Expected Solution / Outcome <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="Describe the desired end state. What should the solution achieve?"
                value={form.expectedSolution}
                onChange={e => update('expectedSolution', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Functional Requirements <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="List key functional requirements the solution must fulfill."
                value={form.functionalRequirements}
                onChange={e => update('functionalRequirements', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Technical Requirements</label>
              <textarea
                className="form-textarea"
                placeholder="Specific technical standards, integrations, APIs, compliance requirements."
                value={form.technicalRequirements}
                onChange={e => update('technicalRequirements', e.target.value)}
                style={{ minHeight: 90 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Deliverables <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="What should the startup deliver? Software, hardware, training, documentation, etc."
                value={form.deliverables}
                onChange={e => update('deliverables', e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Success Metrics / KPIs <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="How will success be measured? Quantifiable KPIs and performance targets."
                value={form.successMetrics}
                onChange={e => update('successMetrics', e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>
          </div>
        )}

        {/* Step 3: Procurement */}
        {currentStep === 3 && (
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Procurement Details</h3>

            <div className="form-row cols-2">
              <div className="form-group">
                <label className="form-label">Estimated Budget <span className="required">*</span></label>
                <input className="form-input" placeholder="e.g., ₹4.5 Crore" value={form.budget} onChange={e => update('budget', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Total Timeline <span className="required">*</span></label>
                <input className="form-input" placeholder="e.g., 18 months" value={form.timeline} onChange={e => update('timeline', e.target.value)} />
              </div>
            </div>

            <div className="form-row cols-2">
              <div className="form-group">
                <label className="form-label">Pilot Duration</label>
                <input className="form-input" placeholder="e.g., 6 months" value={form.pilotDuration} onChange={e => update('pilotDuration', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Geographic Scope</label>
                <input className="form-input" placeholder="e.g., Delhi, Mumbai (Phase 1)" value={form.geographicScope} onChange={e => update('geographicScope', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Procurement Pathway</label>
              <select className="form-select" value={form.procurementPathway} onChange={e => update('procurementPathway', e.target.value)}>
                <option value="">Select Pathway</option>
                <option>GeM Portal</option>
                <option>GeM Portal + Direct Procurement</option>
                <option>Ministry Direct Procurement</option>
                <option>Open Tender</option>
              </select>
            </div>

            <div className="info-banner">
              <Globe size={16} />
              <div>
                <strong style={{ color: 'var(--teal-400)' }}>GeM Integration Ready:</strong> Approved challenges will be available for procurement via Government e-Marketplace (GeM) portal in Phase 2.
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Eligibility */}
        {currentStep === 4 && (
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Eligibility Criteria</h3>

            <div className="form-group">
              <label className="form-label">Startup Requirements <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="Type of startup/company eligible to apply. e.g., DPIIT recognised startups, SMEs..."
                value={form.startupRequirements}
                onChange={e => update('startupRequirements', e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience Requirements</label>
              <textarea
                className="form-textarea"
                placeholder="Minimum years of experience, domain expertise required."
                value={form.experience}
                onChange={e => update('experience', e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>

            <div className="form-row cols-2">
              <div className="form-group">
                <label className="form-label">Technical Requirements</label>
                <textarea
                  className="form-textarea"
                  placeholder="Technical capabilities the startup must demonstrate."
                  value={form.techRequirements}
                  onChange={e => update('techRequirements', e.target.value)}
                  style={{ minHeight: 80 }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Financial Requirements</label>
                <textarea
                  className="form-textarea"
                  placeholder="Minimum turnover, funding status, financial health criteria."
                  value={form.financialRequirements}
                  onChange={e => update('financialRequirements', e.target.value)}
                  style={{ minHeight: 80 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Required Certifications</label>
              <input
                className="form-input"
                placeholder="e.g., ISO 9001, BIS certification, NASSCOM member..."
                value={form.certifications}
                onChange={e => update('certifications', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 5: Evaluation Criteria */}
        {currentStep === 5 && (
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Evaluation Criteria</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24 }}>
              Set weightage percentages for each evaluation criterion. Total must equal 100%.
            </p>

            {totalCriteria !== 100 && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 20, fontSize: 13, color: 'var(--red-400)' }}>
                ⚠ Current total: {totalCriteria}%. Must equal 100%.
              </div>
            )}

            {totalCriteria === 100 && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 20, fontSize: 13, color: 'var(--green-400)' }}>
                ✓ Criteria total: 100% — Ready to publish
              </div>
            )}

            {[
              { field: 'technical', label: 'Technical Capability', desc: 'Does the startup have the technical skills and infrastructure?' },
              { field: 'innovation', label: 'Innovation & Novelty', desc: 'How innovative and unique is the proposed solution?' },
              { field: 'scalability', label: 'Scalability', desc: 'Can the solution scale nationally if the pilot succeeds?' },
              { field: 'team', label: 'Team Capability', desc: 'Quality and experience of the founding and delivery team' },
              { field: 'financial', label: 'Financial Stability', desc: 'Financial health to sustain through the pilot period' },
              { field: 'cost', label: 'Cost Effectiveness', desc: 'Value for money relative to the proposed budget' },
            ].map(crit => (
              <div key={crit.field} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13.5 }}>{crit.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{crit.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form[crit.field]}
                      onChange={e => update(crit.field, parseInt(e.target.value) || 0)}
                      style={{
                        width: 64, padding: '6px 10px', background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)', fontSize: 14, fontWeight: 700, textAlign: 'center',
                      }}
                    />
                    <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill teal" style={{ width: `${form[crit.field]}%` }} />
                </div>
              </div>
            ))}

            <div style={{ padding: '12px 16px', background: 'rgba(10,31,60,0.04)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Total</span>
              <span style={{ fontWeight: 800, color: totalCriteria === 100 ? 'var(--green-400)' : 'var(--red-400)', fontSize: 18 }}>{totalCriteria}%</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => handleSave('Draft')} disabled={saving}>
              <Save size={15} /> Save Draft
            </button>
            {currentStep < steps.length ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => handleSave('Published')}
                disabled={saving || totalCriteria !== 100}
              >
                <Globe size={15} /> Publish Challenge
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

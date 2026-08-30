// src/lib/expertMatching.js
// Challenge-aware expert matching. Pure functions so the same contract can be
// served by a real matching API later (see expertsAPI.getRecommended in api.js).

import { expertMentors } from '../data/expertMentors';

const norm = (s) => (s || '').toLowerCase();

/**
 * Score one expert against one government challenge.
 * Returns { score, reasons[] } — reasons drive the "why recommended" copy.
 */
export function scoreExpertForChallenge(expert, challenge) {
  if (!challenge) return { score: expert.matchScore, reasons: [expert.matchReason] };

  const reasons = [];
  let score = 55;

  if (expert.suitableChallenges?.includes(challenge.id)) {
    score += 30;
    reasons.push(`direct experience with this challenge type`);
  }

  const sectorHit = expert.sectors.find(s => norm(challenge.sector).includes(norm(s)) || norm(s).includes(norm(challenge.sector)));
  if (sectorHit) {
    score += 10;
    reasons.push(`${sectorHit.toLowerCase()} sector depth`);
  }

  const haystack = norm([challenge.title, challenge.problem, challenge.expectedSolution, challenge.technicalRequirements, (challenge.tags || []).join(' ')].join(' '));
  const tagHits = expert.expertise.filter(tag => {
    const t = norm(tag).split(/[\s/]+/)[0];
    return t.length > 2 && haystack.includes(t);
  });
  if (tagHits.length) {
    score += Math.min(12, tagHits.length * 5);
    reasons.push(`${tagHits.map(t => t.toLowerCase()).join(', ')} expertise`);
  }

  const geoHit = /rural|panchayat|village|farmer/.test(haystack) && expert.expertise.some(t => /rural|social|community|adoption|farmer/i.test(t));
  if (geoHit) {
    score += 6;
    reasons.push('rural / last-mile deployment track record');
  }

  // Blend with the curated baseline score so ordering stays sensible.
  const blended = Math.round((Math.min(score, 99) * 0.7) + (expert.matchScore * 0.3));
  return {
    score: Math.min(99, blended),
    reasons: reasons.length ? reasons : [norm(expert.matchReason)],
  };
}

/** Human-readable "why this expert" line. */
export function buildMatchExplanation(reasons, challenge) {
  const list = reasons.slice(0, 3).join(', ');
  return challenge
    ? `Recommended because this project requires ${list}.`
    : `Recommended for ${list}.`;
}

/**
 * Rank every expert for a challenge.
 * @returns array of { ...expert, computedScore, matchReasons, explanation }
 */
export function rankExpertsForChallenge(challenge, experts = expertMentors) {
  return experts
    .map(expert => {
      const { score, reasons } = scoreExpertForChallenge(expert, challenge);
      return {
        ...expert,
        computedScore: score,
        matchReasons: reasons,
        explanation: buildMatchExplanation(reasons, challenge),
      };
    })
    .sort((a, b) => b.computedScore - a.computedScore);
}

export function applyExpertFilters(experts, { industry, expertise, sector, minScore, search } = {}) {
  return experts.filter(e => {
    if (industry && e.sectors[0] !== industry) return false;
    if (expertise && !e.expertise.includes(expertise)) return false;
    if (sector && !e.sectors.includes(sector)) return false;
    if (minScore && (e.computedScore ?? e.matchScore) < Number(minScore)) return false;
    if (search) {
      const q = norm(search);
      const hay = norm([e.name, e.role, e.company, e.expertise.join(' '), e.sectors.join(' '), e.mentorship].join(' '));
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// src/services/api.js
// API service layer — Phase 1 uses mock data, Phase 2 replaces with real API calls

import {
  mockUsers,
  mockChallenges,
  mockStartups,
  mockApplications,
  mockPilots,
  mockContracts,
  mockPayments,
  mockScaleups,
  mockMatchingData,
  mockTemplates,
  dashboardStats,
} from '../data/mockData';

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ========== AUTH API ==========
export const authAPI = {
  login: async (role, _email, _password) => {
    await delay(600);
    const user = mockUsers[role];
    if (!user) throw new Error('Invalid role');
    return { success: true, user, token: `mock-token-${role}-${Date.now()}` };
  },

  logout: async () => {
    await delay(200);
    return { success: true };
  },

  getCurrentUser: async (token) => {
    await delay(200);
    const role = token?.split('-')[2];
    return mockUsers[role] || null;
  },
};

// ========== CHALLENGES API ==========
export const challengesAPI = {
  getAll: async (filters = {}) => {
    await delay(400);
    let challenges = [...mockChallenges];
    if (filters.sector) challenges = challenges.filter(c => c.sector === filters.sector);
    if (filters.department) challenges = challenges.filter(c => c.department === filters.department);
    if (filters.status) challenges = challenges.filter(c => c.status === filters.status);
    if (filters.search) challenges = challenges.filter(c =>
      c.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.problem.toLowerCase().includes(filters.search.toLowerCase())
    );
    return challenges;
  },

  getById: async (id) => {
    await delay(300);
    const challenge = mockChallenges.find(c => c.id === id);
    if (!challenge) throw new Error('Challenge not found');
    return challenge;
  },

  create: async (data) => {
    await delay(600);
    const newChallenge = {
      ...data,
      id: `CH-2024-00${mockChallenges.length + 1}`,
      applications: 0,
      shortlisted: 0,
      status: 'Draft',
      publishedDate: null,
    };
    return { success: true, challenge: newChallenge };
  },

  update: async (id, data) => {
    await delay(400);
    return { success: true, challenge: { id, ...data } };
  },

  publish: async (id) => {
    await delay(400);
    return { success: true, message: 'Challenge published successfully' };
  },
};

// ========== STARTUPS API ==========
export const startupsAPI = {
  getAll: async () => {
    await delay(400);
    return mockStartups;
  },

  getById: async (id) => {
    await delay(300);
    const startup = mockStartups.find(s => s.id === id);
    if (!startup) throw new Error('Startup not found');
    return startup;
  },

  updateProfile: async (id, data) => {
    await delay(500);
    return { success: true, startup: { id, ...data } };
  },
};

// ========== APPLICATIONS API ==========
export const applicationsAPI = {
  getAll: async (challengeId) => {
    await delay(400);
    if (challengeId) return mockApplications.filter(a => a.challengeId === challengeId);
    return mockApplications;
  },

  getById: async (id) => {
    await delay(300);
    return mockApplications.find(a => a.id === id);
  },

  submit: async (data) => {
    await delay(800);
    const newApp = {
      ...data,
      id: `APP-2024-00${mockApplications.length + 1}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
    };
    return { success: true, application: newApp };
  },

  updateStatus: async (id, status) => {
    await delay(400);
    return { success: true, message: `Application ${status}` };
  },

  evaluate: async (id, scores) => {
    await delay(500);
    const total = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
    return { success: true, overallScore: total };
  },
};

// ========== PILOTS API ==========
export const pilotsAPI = {
  getAll: async () => {
    await delay(400);
    return mockPilots;
  },

  getById: async (id) => {
    await delay(300);
    return mockPilots.find(p => p.id === id);
  },

  updateMilestone: async (pilotId, milestoneIdx, status) => {
    await delay(400);
    return { success: true, message: 'Milestone updated' };
  },

  submitReport: async (pilotId, month, data) => {
    await delay(500);
    return { success: true, message: 'Report submitted' };
  },
};

// ========== CONTRACTS API ==========
export const contractsAPI = {
  getAll: async () => {
    await delay(400);
    return mockContracts;
  },

  getById: async (id) => {
    await delay(300);
    return mockContracts.find(c => c.id === id);
  },
};

// ========== PAYMENTS API ==========
export const paymentsAPI = {
  getAll: async () => {
    await delay(400);
    return mockPayments;
  },

  initiate: async (id) => {
    await delay(600);
    return { success: true, message: 'Payment initiated', transactionId: `NEFT${Date.now()}` };
  },
};

// ========== MATCHING API ==========
export const matchingAPI = {
  getMatches: async (role, entityId) => {
    await delay(800);
    // Simulate AI matching computation delay
    return mockMatchingData;
  },

  runEngine: async () => {
    await delay(1200);
    return { success: true, matches: mockMatchingData, computedAt: new Date().toISOString() };
  },
};

// ========== SCALEUPS API ==========
export const scaleupsAPI = {
  getAll: async () => {
    await delay(400);
    return mockScaleups;
  },

  recommend: async (pilotId, decision) => {
    await delay(500);
    return { success: true, decision, message: `Scale-up decision: ${decision}` };
  },
};

// ========== TEMPLATES API ==========
export const templatesAPI = {
  getAll: async () => {
    await delay(300);
    return mockTemplates;
  },

  download: async (id) => {
    await delay(400);
    return { success: true, message: 'Download started' };
  },
};

// ========== DASHBOARD API ==========
export const dashboardAPI = {
  getStats: async (role) => {
    await delay(400);
    return dashboardStats[role] || dashboardStats.government;
  },
};

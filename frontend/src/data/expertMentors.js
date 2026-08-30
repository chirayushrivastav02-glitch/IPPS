// src/data/expertMentors.js
// Demo expert/mentor network for IPPS Setu. Every profile is FICTIONAL and is
// surfaced in the UI with a "Demo Expert" label. Shape is intentionally close to
// what a future /api/experts endpoint would return so the swap is a one-file change.

export const expertMentors = [
  {
    id: "EXP-001",
    name: "Aarav Mehta",
    role: "Founder & Water Innovation Expert",
    company: "AquaNova Labs",
    expertise: ["Water Technology", "IoT", "ClimateTech", "Operations"],
    sectors: ["Water & Sanitation", "IoT", "ClimateTech"],
    suitableChallenges: ["CH-2024-001"],
    experience: "18+ years",
    matchReason: "Strong experience in IoT-based water monitoring and field deployment",
    matchScore: 95,
    mentorship: "Product Strategy & Field Deployment"
  },
  {
    id: "EXP-002",
    name: "Nisha Verma",
    role: "Urban Innovation Entrepreneur",
    company: "UrbanLoop Technologies",
    expertise: ["Waste Management", "Smart Cities", "Logistics", "IoT"],
    sectors: ["Urban Development", "Waste Management", "Smart City"],
    suitableChallenges: ["CH-2024-002"],
    experience: "14+ years",
    matchReason: "Expertise in waste collection optimization and smart-city operations",
    matchScore: 93,
    mentorship: "Operations & Scaling"
  },
  {
    id: "EXP-003",
    name: "Rohan Iyer",
    role: "HealthTech Founder",
    company: "MediGrid Innovations",
    expertise: ["HealthTech", "Digital Health", "Healthcare Systems", "Data"],
    sectors: ["Healthcare", "HealthTech", "Digital Governance"],
    suitableChallenges: ["CH-2024-003"],
    experience: "16+ years",
    matchReason: "Experience integrating digital health platforms with institutional systems",
    matchScore: 97,
    mentorship: "Healthcare Product & Integration"
  },
  {
    id: "EXP-004",
    name: "Kavya Deshmukh",
    role: "AgriTech Entrepreneur",
    company: "FarmSphere Technologies",
    expertise: ["AgriTech", "AI", "Precision Agriculture", "Farmer Solutions"],
    sectors: ["Agriculture", "AI/ML", "AgriTech"],
    suitableChallenges: ["CH-2024-004"],
    experience: "12+ years",
    matchReason: "Strong experience building farmer-focused advisory and AI products",
    matchScore: 96,
    mentorship: "Product Adoption & Rural Deployment"
  },
  {
    id: "EXP-005",
    name: "Vikram Rao",
    role: "Infrastructure Technology Entrepreneur",
    company: "InfraSense Systems",
    expertise: ["Computer Vision", "Infrastructure", "Drones", "Predictive Maintenance"],
    sectors: ["Infrastructure", "AI/ML", "Computer Vision"],
    suitableChallenges: ["CH-2024-005"],
    experience: "17+ years",
    matchReason: "Relevant experience in automated infrastructure inspection",
    matchScore: 94,
    mentorship: "Technology Validation & Deployment"
  },
  {
    id: "EXP-006",
    name: "Meera Kapoor",
    role: "GovTech Entrepreneur",
    company: "CivicBridge Digital",
    expertise: ["GovTech", "Digital Public Services", "Citizen Platforms", "SaaS"],
    sectors: ["Governance", "GovTech", "Digital Services"],
    suitableChallenges: ["CH-2024-006"],
    experience: "15+ years",
    matchReason: "Experience designing scalable citizen-facing digital platforms",
    matchScore: 98,
    mentorship: "GovTech Strategy & Public Adoption"
  },
  {
    id: "EXP-007",
    name: "Arjun Malhotra",
    role: "AI & Enterprise Technology Founder",
    company: "NovaCore AI",
    expertise: ["AI/ML", "SaaS", "Enterprise Technology", "Scaling"],
    sectors: ["AI/ML", "SaaS", "Enterprise"],
    suitableChallenges: ["CH-2024-001", "CH-2024-003", "CH-2024-004"],
    experience: "13+ years",
    matchReason: "Strong AI product and enterprise deployment experience",
    matchScore: 91,
    mentorship: "AI Product Strategy"
  },
  {
    id: "EXP-008",
    name: "Simran Bhatia",
    role: "Business Growth Entrepreneur",
    company: "ScaleGrid Ventures",
    expertise: ["Business Strategy", "Fundraising", "Go-to-Market", "Scaling"],
    sectors: ["Cross-sector", "SaaS", "Consumer", "DeepTech"],
    suitableChallenges: ["CH-2024-001", "CH-2024-002", "CH-2024-004", "CH-2024-005"],
    experience: "19+ years",
    matchReason: "Helps startups transition from pilot stage to scalable operations",
    matchScore: 89,
    mentorship: "Growth & Scaling"
  },
  {
    id: "EXP-009",
    name: "Dev Khanna",
    role: "Cybersecurity & Digital Trust Expert",
    company: "SecureAxis Technologies",
    expertise: ["Cybersecurity", "Data Privacy", "Cloud", "Compliance"],
    sectors: ["Healthcare", "GovTech", "Cloud", "Cybersecurity"],
    suitableChallenges: ["CH-2024-003", "CH-2024-006"],
    experience: "16+ years",
    matchReason: "Relevant for sensitive citizen and healthcare data systems",
    matchScore: 92,
    mentorship: "Security & Compliance"
  },
  {
    id: "EXP-010",
    name: "Ishita Rao",
    role: "Social Innovation Entrepreneur",
    company: "ImpactWorks India",
    expertise: ["Social Impact", "Rural Innovation", "Community Adoption", "Public Programs"],
    sectors: ["Agriculture", "Healthcare", "Governance"],
    suitableChallenges: ["CH-2024-003", "CH-2024-004", "CH-2024-006"],
    experience: "11+ years",
    matchReason: "Strong experience with adoption of technology in underserved communities",
    matchScore: 90,
    mentorship: "Impact & User Adoption"
  }
];

// Filter option lists derived from the dataset (no hard-coded duplicates).
export const expertIndustries = [...new Set(expertMentors.map(e => e.sectors[0]))].sort();
export const expertExpertiseTags = [...new Set(expertMentors.flatMap(e => e.expertise))].sort();
export const expertSectors = [...new Set(expertMentors.flatMap(e => e.sectors))].sort();
export const mentorshipTypes = [...new Set(expertMentors.map(e => e.mentorship))].sort();

export const mentorshipStages = ['Requested', 'Scheduled', 'Completed'];

import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import GovernmentLayout from "@/layouts/GovernmentLayout";
import StartupLayout from "@/layouts/StartupLayout";

import LandingPage from "@/pages/public/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";

import GovDashboard from "@/pages/government/GovDashboard";
import ChallengesPage from "@/pages/government/ChallengesPage";
import CreateChallengePage from "@/pages/government/CreateChallengePage";
import EvaluationPage from "@/pages/government/EvaluationPage";

import StartupDashboard from "@/pages/startup/StartupDashboard";
import MarketplacePage from "@/pages/startup/MarketplacePage";
import ChallengeDetailPage from "@/pages/startup/ChallengeDetailPage";
import SubmitProposalPage from "@/pages/startup/SubmitProposalPage";
import ApplicationsPage from "@/pages/startup/ApplicationsPage";
import ExpertNetworkPage from "@/pages/startup/ExpertNetworkPage";
import ExpertProfilePage from "@/pages/startup/ExpertProfilePage";
import ComingSoon from "@/pages/ComingSoon";

// BrowserRouter is already mounted in main.tsx — this file owns the route table.
const govModules = [
  ["startups", "Startup Registry"],
  ["matching", "AI Matching Engine"],
  ["pilots", "Pilot Management"],
  ["procurement", "Procurement"],
  ["payments", "Payments"],
  ["scaleup", "Scale-Up"],
  ["templates", "Templates Library"],
  ["notifications", "Notifications"],
];

const startupModules = [
  ["recommended", "Recommended Challenges"],
  ["matching", "AI Matching Engine"],
  ["pilots", "My Pilots"],
  ["contracts", "Contracts"],
  ["payments", "Payments"],
  ["scaleup", "Scale-Up Opportunities"],
  ["profile", "Company Profile"],
  ["documents", "Documents"],
  ["notifications", "Notifications"],
];

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Government portal */}
        <Route path="/gov" element={<Navigate to="/gov/dashboard" replace />} />
        <Route
          path="/gov/dashboard"
          element={
            <GovernmentLayout>
              <GovDashboard />
            </GovernmentLayout>
          }
        />
        <Route
          path="/gov/challenges"
          element={
            <GovernmentLayout>
              <ChallengesPage />
            </GovernmentLayout>
          }
        />
        <Route
          path="/gov/challenges/create"
          element={
            <GovernmentLayout>
              <CreateChallengePage />
            </GovernmentLayout>
          }
        />
        <Route
          path="/gov/challenges/:id/edit"
          element={
            <GovernmentLayout>
              <CreateChallengePage />
            </GovernmentLayout>
          }
        />
        <Route
          path="/gov/challenges/:id"
          element={
            <GovernmentLayout>
              <ChallengeDetailPage portal="gov" />
            </GovernmentLayout>
          }
        />
        <Route
          path="/gov/evaluation"
          element={
            <GovernmentLayout>
              <EvaluationPage />
            </GovernmentLayout>
          }
        />
        {govModules.map(([slug, title]) => (
          <Route
            key={slug}
            path={`/gov/${slug}`}
            element={
              <GovernmentLayout>
                <ComingSoon title={title} backTo="/gov/dashboard" />
              </GovernmentLayout>
            }
          />
        ))}

        {/* Startup portal */}
        <Route path="/startup" element={<Navigate to="/startup/dashboard" replace />} />
        <Route
          path="/startup/dashboard"
          element={
            <StartupLayout>
              <StartupDashboard />
            </StartupLayout>
          }
        />
        <Route
          path="/startup/marketplace"
          element={
            <StartupLayout>
              <MarketplacePage />
            </StartupLayout>
          }
        />
        <Route
          path="/startup/marketplace/:id"
          element={
            <StartupLayout>
              <ChallengeDetailPage portal="startup" />
            </StartupLayout>
          }
        />
        <Route
          path="/startup/marketplace/:id/apply"
          element={
            <StartupLayout>
              <SubmitProposalPage />
            </StartupLayout>
          }
        />
        <Route
          path="/startup/applications"
          element={
            <StartupLayout>
              <ApplicationsPage />
            </StartupLayout>
          }
        />
        <Route
          path="/startup/experts"
          element={
            <StartupLayout>
              <ExpertNetworkPage />
            </StartupLayout>
          }
        />
        <Route
          path="/startup/experts/:id"
          element={
            <StartupLayout>
              <ExpertProfilePage />
            </StartupLayout>
          }
        />
        {startupModules.map(([slug, title]) => (
          <Route
            key={slug}
            path={`/startup/${slug}`}
            element={
              <StartupLayout>
                <ComingSoon title={title} backTo="/startup/dashboard" />
              </StartupLayout>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuspenseLoader from "../components/suspense-loader";
import { Layout } from "../components/layouts/layout";
import { AuthenticatedRoute } from "./authenticated-route";

// Public Pages
const LandingPage = lazy(() => import("../pages/public/landing"));
const LoginPage = lazy(() => import("../pages/public/login"));
const RegisterPage = lazy(() => import("../pages/public/register"));
const NotFoundPage = lazy(() => import("../pages/public/not-found"));

// Shared Auth Pages
const NotificationsPage = lazy(
  () => import("../pages/private-shared/notifications")
);
const Leaderboard = lazy(() => import("../pages/private-shared/leaderboard"));

const PitchRoomPage = lazy(() => import("../pages/private-shared/pitch-room"));

// Founder Pages
const FounderDashboard = lazy(
  () => import("../pages/founder/founder-dashboard")
);
const CreateStartupProfile = lazy(
  () => import("../pages/founder/create-startup-profile")
);

const FundingSimulation = lazy(
  () => import("../pages/founder/funding-simulation")
);
const CapTableView = lazy(() => import("../pages/founder/founder-cap-table"));

const PitchHistory = lazy(
  () => import("../pages/founder/founder-pitch-history")
);

// Investor Pages
const InvestorDashboard = lazy(
  () => import("../pages/investor/investor-dashboard")
);
const InvestorBrowse = lazy(() => import("../pages/investor/investor-browse"));
const InvestorOffers = lazy(
  () => import("../pages/investor/investor-funding-offers")
);
const InvestorInvitations = lazy(
  () => import("../pages/investor/investor-invitations")
);
const InvestorHistory = lazy(
  () => import("../pages/investor/investor-history")
);

// Shared Chat
const PitchRoom = lazy(() => import("../pages/private-shared/pitch-room"));

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Private Routes */}
        <Route
          element={
            <AuthenticatedRoute>
              <Layout />
            </AuthenticatedRoute>
          }
        >
          {/* Shared Auth */}
          <Route path="/pitchRoom/:roomId" element={<PitchRoomPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Founder */}
          <Route path="/founder/dashboard" element={<FounderDashboard />} />
          <Route
            path="/founder/createStartUpProfile"
            element={<CreateStartupProfile />}
          />

          <Route
            path="/founder/funding-simulation"
            element={<FundingSimulation />}
          />
          <Route path="/founder/cap-table" element={<CapTableView />} />

          <Route path="/founder/pitch-room/:roomId" element={<PitchRoom />} />
          <Route path="/founder/pitch-history" element={<PitchHistory />} />

          {/* Investor */}
          <Route path="/investor/dashboard" element={<InvestorBrowse />} />
          <Route path="/investor/browse" element={<InvestorBrowse />} />
          <Route path="/investor/funding-offers" element={<InvestorOffers />} />
          <Route
            path="/investor/invitations"
            element={<InvestorInvitations />}
          />
          <Route path="/investor/pitch-room/:roomId" element={<PitchRoom />} />
          <Route path="/investor/history" element={<InvestorHistory />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;

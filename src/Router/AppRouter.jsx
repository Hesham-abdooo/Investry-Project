import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "../Pages/LandingPage/LandingPage";
import Login from "../Pages/Authentication/Login";
import SignUp from "../Pages/Authentication/SignUp";
import EmailCheck from "../Pages/Authentication/EmailCheck.jsx";
import EmailConfirm from "../Pages/Authentication/EmailConfirm.jsx";
import ForgotPassword from "../Components/Authentication/Login/ForgotPassword.jsx";
import ResetPassword from "../Components/Authentication/Login/ResetPassword.jsx";
import NotFound from "../Pages/NotFound/NotFound";

import Investor from "../Pages/Investor/Investor.jsx";
import InvestorDashboard from "../Components/Investor/InvestorLayout/InvestorDashboard.jsx";
import InvestorWallet from "../Components/Investor/InvestorLayout/InvestorWallet.jsx";
import ProjectDetails from "../Components/Investor/InvestorLayout/ProjectDetails.jsx";

import FounderDasboard from "../Pages/Founder/FounderDashboard.jsx";
import FounderWallet from "../Pages/Founder/FounderWallet.jsx";
import FounderAnalytics from "../Pages/Founder/FounderAnalytics.jsx";
import FounderSupport from "../Pages/Founder/FounderSupport.jsx";
import FounderProfile from "../Pages/Founder/FounderProfile.jsx";
import FounderCreateProject from "../Components/Founder/FounderLayout/CreateProject/FounderCreateProject.jsx";
import FounderLayout from "../Components/Layouts/Founder/FounderLayout.jsx";
import FounderProjects from "../Pages/Founder/FounderProjects.jsx";
import FounderProjectDetails from "../Pages/Founder/FounderProjectDetails.jsx";
import FounderEditProject from "../Pages/Founder/FounderEditProject.jsx";

import ProtectedRoute from "../../src/Components/Routes/ProtectedRoute.jsx";

const routes = createBrowserRouter([
  // Landing
  {
    path: "/",
    element: <LandingPage />,
  },

  // Auth
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/email-check", element: <EmailCheck /> },
  { path: "/email-confirm", element: <EmailConfirm /> },

  // Investor
  {
    path: "/investor",
    element: (
      <ProtectedRoute allowedRoles={["investor"]}>
        <Investor />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <InvestorDashboard /> },
      { path: "investorDashboard", element: <InvestorDashboard /> },
      { path: "wallet", element: <InvestorWallet /> },
      { path: "project/:id", element: <ProjectDetails /> },
    ],
  },

  // Founder
  {
    path: "/founder",
    element: (
      <ProtectedRoute allowedRoles={["founder"]}>
        <FounderLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <FounderDasboard /> },
      { path: "projects", element: <FounderProjects /> },
      { path: "projects/:id", element: <FounderProjectDetails /> },
      { path: "projects/:id/edit", element: <FounderEditProject /> },
      { path: "wallet", element: <FounderWallet /> },
      { path: "analytics", element: <FounderAnalytics /> },
      { path: "support", element: <FounderSupport /> },
      { path: "profile", element: <FounderProfile /> },
    ],
  },

  // 🔥 مهم: نحمي create project
  {
    path: "/createProject",
    element: (
      <ProtectedRoute allowedRoles={["founder"]}>
        <FounderCreateProject />
      </ProtectedRoute>
    ),
  },

  // Forgot / Reset
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },

  // NotFound
  { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
  return <RouterProvider router={routes} />;
}
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
import InvestorMyInvestments from "../Components/Investor/InvestorLayout/InvestorMyInvestments.jsx";
import InvestorProfile from "../Components/Investor/InvestorLayout/InvestorProfile.jsx";
import InvestorSupport from "../Pages/Investor/InvestorSupport.jsx";

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

import AdminLayout from "../Components/Layouts/Admin/AdminLayout.jsx";
import AdminDashboard from "../Pages/Admin/AdminDashboard.jsx";
import AdminProjects from "../Pages/Admin/AdminProjects.jsx";
import AdminEscrow from "../Pages/Admin/AdminEscrow.jsx";

import ProtectedRoute from "../../src/Components/Routes/ProtectedRoute.jsx";

import PaymentSuccess from "../Pages/Payment/PaymentSuccess.jsx";

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

  // Payment Success (Stripe redirect)
  { path: "/payment-success", element: <PaymentSuccess /> },
  { path: "/payment/success", element: <PaymentSuccess /> },
  { path: "/wallet/success", element: <PaymentSuccess /> },
  { path: "/success", element: <PaymentSuccess /> },

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
      { path: "investments", element: <InvestorMyInvestments /> },
      { path: "wallet", element: <InvestorWallet /> },
      { path: "profile", element: <InvestorProfile /> },
      { path: "support", element: <InvestorSupport /> },
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

  // Admin
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["administrator"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "projects", element: <AdminProjects /> },
      { path: "escrow", element: <AdminEscrow /> },
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
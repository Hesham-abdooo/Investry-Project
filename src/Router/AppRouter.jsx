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

const routes = createBrowserRouter([
  // ! Routing Landing page
  {
    path: "/",
    element: <LandingPage />,
  },

  // ! Routing Auth pages
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },

  // !
  { path: "/email-check", element: <EmailCheck /> },
  { path: "/email-confirm", element: <EmailConfirm /> },

  //! Routing Investor Page
  {
    path: "/investor",
    element: <Investor />,
    children: [
      { index: true, element: <InvestorDashboard /> },
      { path: "investorDashboard", element: <InvestorDashboard /> },
      { path: "wallet", element: <InvestorWallet /> },
      { path: "project/:id", element: <ProjectDetails /> },
    ],
  },

  //! Routing Founder Page
  {
    path: "/founder",
    element: <FounderLayout/>,
    children: [
      { index: true, element: <FounderDasboard /> },
      { path: "FounderDashboard", element: <FounderDasboard /> },
      { path: "projects", element: <FounderProjects/>},
      { path: "wallet", element: <FounderWallet /> },
      { path: "analytics", element: <FounderAnalytics /> },
      { path: "support", element: <FounderSupport /> },
      { path: "profile", element: <FounderProfile /> },
    ],
  },
  { path: "/createProject", element: <FounderCreateProject /> },

  //! Routing Forgot,Reset Password
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },

  //! Routing NotFound Page
  { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
  return <RouterProvider router={routes} />;
}

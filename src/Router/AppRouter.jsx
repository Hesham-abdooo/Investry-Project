import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "../Pages/LandingPage/LandingPage";
import Login from "../Pages/Authentication/Login";
import SignUp from "../Pages/Authentication/SignUp";
import NotFound from "../Pages/NotFound/NotFound";

import Investor from "../Pages/Investor/Investor.jsx";
import InvestorDashboard from "../Components/Investor/InvestorLayout/InvestorDashboard.jsx";
import Founder from "../Pages/Founder/Founder.jsx";
import FounderDasboard from "../Components/Founder/FounderLayout/FounderDasboard.jsx";
import ForgotPassword from "../Components/Login/ForgotPassword.jsx";
import ResetPassword from "../Components/Login/ResetPassword.jsx";
import LogOut from "../Pages/LogOut/LogOut.jsx";
import FounderProjects from "../Components/Founder/FounderLayout/FounderProjects.jsx";
import FounderWallet from "../Components/Founder/FounderLayout/FounderWallet.jsx";
import FounderAnalytics from "../Components/Founder/FounderLayout/FounderAnalytics.jsx";
import FounderSupport from "../Components/Founder/FounderLayout/FounderSupport.jsx";
import FounderProfile from "../Components/Founder/FounderLayout/FounderProfile.jsx";
const routes = createBrowserRouter([
  // ! Routing Landing page
  {
    path: "/",
    element: <LandingPage />,
  },

  // ! Routing Auth pages
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },

  //! Routing Investor Page
  {
    path: "/investor",
    element: <Investor />,
    children: [
      { index: true, element: <InvestorDashboard /> },
      { path: "investorDashboard", element: <InvestorDashboard /> },
    ],
  },

  //! Routing Founder Page
  {
    path: "/founder",
    element: <Founder />,
    children: [
      { index: true, element: <FounderDasboard /> },
      { path: "FounderDashboard", element: <FounderDasboard /> },
      { path: "projects", element: <FounderProjects /> },
      { path: "wallet", element: <FounderWallet /> },
      { path: "analytics", element: <FounderAnalytics /> },
      { path: "support", element: <FounderSupport /> },
      { path: "profile", element: <FounderProfile /> },
    ],
  },



  //! Routing Forgot,Reset Password
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },

  //!Routing LogOut
  { path: "/LogOut", element: <LogOut /> },



    //! Routing NotFound Page
  { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
  return (
      <RouterProvider router={routes} />
  );
}

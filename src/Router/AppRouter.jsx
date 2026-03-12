import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "../Pages/LandingPage/LandingPage";
import Login from "../Pages/Authentication/Login";
import SignUp from "../Pages/Authentication/SignUp";
import NotFound from "../Pages/NotFound/NotFound";
import Home from "../Components/LandingPage/Home.jsx";
import Investor from "../Pages/Investor/Investor.jsx";
import InvestorDashboard from "../Components/Investor/InvestorLayout/InvestorDashboard.jsx";




import Founder from "../Pages/Founder/Founder.jsx";
import FounderDasboard from "../Components/Founder/FounderLayout/FounderDasboard.jsx";
const routes = createBrowserRouter([
  // ! Routing Landing page
  {
    path: "",
    element: <LandingPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
    
    ],
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
      {index:true,element:<FounderDasboard/>},
      {path:"founderDashboard",element:<FounderDasboard/>},
    
    ],
  },


//! Routing NotFound Page
    { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
  
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

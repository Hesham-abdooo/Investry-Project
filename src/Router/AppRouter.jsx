import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "../Pages/LandingPage/LandingPage";
import Login from "../Pages/Authentication/Login";
import SignUp from "../Pages/Authentication/SignUp";
import NotFound from "../Pages/NotFound/NotFound";
import Home from "../Components/LandingPage/Home.jsx";

const routes = createBrowserRouter([
  {
    path: "",
    element: <LandingPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return (
    <>
      <div className="bg-red-700">app</div>
      <RouterProvider router={routes} />
    </>
  );
}

import React from "react";
import { Outlet } from "react-router-dom";
import FounderSideBar from "../../Components/Founder/FounderSideBar/FounderSideBar";

export default function Founder() {
  return (
    <>
      <FounderSideBar/>
      <Outlet />
    </>
  );
}

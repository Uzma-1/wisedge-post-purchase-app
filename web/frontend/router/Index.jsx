import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainContainer from "../layout/MainContainer";
import HomePage from "../pages";
import GoldenUpsell from "../pages/GoldenUpsell";
import FunnelTriggerCondition from "../pages/FunnelTriggerCondition";
import AddFunnel from "../pages/AddFunnel";
import EditFunnel from "../pages/EditFunnel";

const Index = () => {


  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainContainer />}>
          <Route index element={<HomePage />} />
          <Route path="/golden-single-click-funnel" element={<GoldenUpsell />} />
          <Route path="/funnel-trigger-condition" element={<FunnelTriggerCondition />} />
          <Route path="/add-new-funnel" element={<AddFunnel />} />
          <Route path="/edit-funnel/:Id" element={<EditFunnel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Index;
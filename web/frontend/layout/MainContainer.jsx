import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const MainContainer = () => {
    return(
        <>
        <section className="main-outer-section">
		    <div className="custom-inner-section">
                <SideBar />
                <div className="cstm-main-content-body right-side">
                <Outlet />
                </div>
            </div>
        </section>
        </>
    )
}

export default MainContainer;
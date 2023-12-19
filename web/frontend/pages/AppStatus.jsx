import React, { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";

const AppStatus = () =>  {

    const [shopData, setShopData] = useState();
    const fetch = useAuthenticatedFetch();


    async function getShopData(){
        const response = await fetch("/api/shopToken");
        const data = await response.json();
        setShopData(data);
    }

    useEffect(() => {
        getShopData();
    }, []);


    const handleStatus = async (Id, e) => {
        const newStatus = e.target.checked;
        try {
            await fetch(`/api/shopStatus`, {
                method: "PUT",
                body: JSON.stringify({ 
                    Id: Id, 
                    status: newStatus ? "true" : "false" }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const updatedShops = shopData.map((shop) => {
                if (shop.Id === Id) {
                    return { ...shop, status: newStatus ? "true" : "false" };
                }
                return shop;
            });

            setShopData(updatedShops);
        } catch (error) {
            console.error("Error updating shop status:", error);
        }
    };
    



    return (
        <>
            <div className="main_title ">
                <h1>App Status</h1>
            </div>
            <div className="section_style content-section_3 section mt-3">
                <div className="sec_main d-flex justify-content-between align-items-center">
                    <div className="welcome_text">
                        <h4 className="mb-0">Enable / Disable App</h4>
                    </div>
                    {
                    shopData && shopData?.map((data, i) => (
                        <div className="tc status" key={i}>
                            <label className={`toggle ${data.status === "true" ? "status-active" : ""}`}>
                                <input
                                    type="checkbox"
                                    checked={data.status === "true"}
                                    onChange={(e) => handleStatus(data.Id, e)}
                                />
                                <span className="slider"></span>
                                {data.status === "true" ? (
                                    <span className="labels" data-on="ON"></span>
                                ) : (
                                    <span className="labels" data-off="OFF"></span>
                            )}
                    </label>
                </div>
            ))}
                </div>
            </div>
        </>
    )
}

export default AppStatus;
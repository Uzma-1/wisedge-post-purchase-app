import React, { useEffect, useState } from "react";
import TopCard from "../components/TopCard";
import Cards from "../components/Cards";
import WelcomeCard from "../components/WelcomeCard";
import { useAuthenticatedFetch } from "../hooks";
import Loader from "../components/Loader";

export default function HomePage() {
  const fetch = useAuthenticatedFetch();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);
  const [sale, setSale] = useState([]);
  const [todaySale, setTodaySale] = useState([]);

  // Use a ref to track if the component is mounted
  const isMounted = React.useRef(true);

  async function getShopToken() {
    const response = await fetch("/api/shopToken");
    const data = await response.json();
    if (isMounted.current) {
      setToken(data);
    }
  }

  console.log('token', token);
  
  async function getSale() {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      });

      if (!isMounted.current) {
        return; // Component unmounted, exit early
      }

      if (!response.ok) {
        throw new Error("Error: " + response.status);
      }

      const responseData = await response.json();

      if (isMounted.current) {
        setSale(responseData);
        setLoading(false); // Set loading to false here
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }

  useEffect(() => {
    // Component is mounted
    isMounted.current = true;
    getShopToken();
    getSale();

    // Cleanup: Component will unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1500);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TopCard sale={sale} />
          <Cards todaySale={sale} />
          <WelcomeCard />
        </>
      )}
    </>
  );
}

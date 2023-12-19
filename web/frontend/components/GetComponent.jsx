import React, { useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";


const GetComponent = () => {
    const fetch = useAuthenticatedFetch();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/graphql");
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, [fetch]);
  
    return(
        <>
        </>
    )
}

export default GetComponent;
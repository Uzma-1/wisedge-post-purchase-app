import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductAction } from "../redux/action/ProductAction";



const Detail = () => {

    const [data, setData] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        getDataHandler();
    }, []);

    function getDataHandler() {
        dispatch(ProductAction(data));
        console.log(data, "data ");
    }

    return(
        <>
            <button onClick={getDataHandler}>click here</button>
        </>
    )
}

export default Detail;
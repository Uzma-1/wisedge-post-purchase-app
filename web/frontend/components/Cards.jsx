import React, { useState } from "react";
import revenue from '../assets/images/revenue.png';
import orderValue from '../assets/images/order_value.png';
import upsellValue from '../assets/images/upsell_value.png';

const Cards = (props) => {

    const today_sale = props.todaySale;
    const today_amount = today_sale.today_sales;
    const upsell_avrg = today_sale.upsell_avrg;
    const order_avrg = today_sale.average_sale_all_tags;


    const cardData = [
        {
            icon: revenue,
            price: "$" + today_amount,
            cont: 'Today’ upsell revenue'
        },
        {
            icon: orderValue,
            price: "$" + upsell_avrg,
            cont: 'Today’ avg upsell value'
        },
        {
            icon: upsellValue,
            price: '$' + order_avrg,
            cont: 'Today’ avg order value'
        }
    ]

    return(
        <div className="content-section_2 section">
            <div className="d_flex rav_inr">
                {
                    cardData.map((data, i) => {
                        return(
                            <div className="cstm_upsell_revenue section_style upsales_items" key={i}>
                                <img className="" src={data.icon} alt={data.icon} />
                                <h3>{data.price}</h3>
                                <span>{data.cont}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Cards;
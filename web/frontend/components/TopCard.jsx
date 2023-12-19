import React from "react";
import EarnAbs from '../assets/images/earn_abs.png';
import EarnRep from '../assets/images/earn_rep.png';

const TopCard = (props) => {

    const final_sale = props.sale;
    const final_amount = "$" + final_sale.total_sales_wisedge;

    const EarnData =
    {
        title: 'Wisedge Post Purchase Upsell has made you an extra',
        price: final_amount
    }
    return(
        <>
            <div className="section_style content-section_1 section">
                <div className="cstm_earning">
                    <div className="earn_report">
                        <h2>{EarnData.title}</h2>
                        <span>{EarnData.price}</span>
                    </div>
                    <div className="report_images">
                        <img className="img_abs" src={EarnAbs} alt="EarnAbs" />
                        <img className="img_nor" src={EarnRep} alt ="EarnRep" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopCard;
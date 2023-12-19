import React from "react";
import BacImg from '../assets/images/bg.png';
import upsellLogo from '../assets/images/upsell-logo.svg';

const WelcomeCard = () => {
    return(
        <div className="section_style content-section_3 section">
            <div className="sec_main">
                <div className="welcome_text">
                    <h4>Golden Single Click Upsell: Walkthrough with Lorem Store</h4>
                    <p>Watch this short welcome video for high-level information about how the app works on your
                        store!</p>
                </div>
                <div className="welcome_image">
                    <img className="" src={BacImg} alt="BacImg" />
                    <div className="welcome_content">
                        <h1>Welcome</h1>
                        <div className="wellcome_inr">
                            <h2>to</h2>
                            <span>
                                <img src={upsellLogo} alt="upsellLogo" />
                            </span>
                            <h3>UPSELL</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WelcomeCard;
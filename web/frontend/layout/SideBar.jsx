import React from "react";
import logo from '../assets/images/Logo.png';
import Home from '../assets/images/home.png';
import Funnel from '../assets/images/Funnel.png';
import Analytics from  '../assets/images/Analytics.png'
import { Link, NavLink } from "react-router-dom";
import Notification from '../assets/images/notification.png';
import Info from '../assets/images/info.png';
import Setting from '../assets/images/setting.png';
import LogOut from '../assets/images/logout.png';
import ArrowTop from '../assets/images/arrow-top.png'

const SideBar = () => {

    const navbarRoutes = [
        {
          name: "Home",
          path: "/",
          icon: Home,
        },
        {
          name: "Funnel",
          path: "/goldenUpsell",
          icon: Funnel,
        },
        {
          name: "Analytics",
          path: "/appStatus",
          icon: Analytics,
        }
      ];

      const navbarIcons = [
        {
            icon: Notification
        },
        {
            icon: Info
        },
        {
            icon: Setting
        },
        {
            icon: LogOut
        }
      ]

    return(
        <>
            <header className="cstm-header-section left-side">
				<div className="cstm-logo-section">
					<img src={logo} alt="logo" className="logo-img" />
				</div>
				<div className="nav_iner">
					<nav className="cstm-nav-section">
                        {
                            navbarRoutes.map((data, i) => {
                                return(
                                    <ul className="cstm-nav" key={i}>
                                        <li className="cstm-nav-item">
                                            <NavLink to={data.path} className="">
                                                <img src={data.icon} className="nav-icon" />
                                            </NavLink>
                                        </li>
                                    </ul>
                                )
                            })
                        }
					</nav>
					<div className="cstm-icon-section">
						<ul>
							<li className="cstm-settings">
								{/* <button className="button_icn">
									<img src={ArrowTop} alt="arrow-top" />
								</button> */}
								<div className="banner_icn">
									<span className="cstm-settings">
                                        <Link to="#">
                                            <img src={Notification} alt="sidebar-icon" />
                                        </Link>
                                    </span>
									<span className="cstm-settings">
                                        <Link to="#">
                                            <img src={Info} alt="sidebar-icon" />
                                        </Link>
                                    </span>
								</div>
							</li>
                            </ul>
                            {/* {
                                navbarIcons.map((item, i) => {
                                    return(
                                        <ul key={i}>
							                <li className="cstm-settings">
                                                <Link to="#">
                                                    <img src={item.icon} alt="sidebar-icon" />
                                                </Link>
                                            </li>
                                        </ul>
                                    )
                                })
                            } */}
					</div>
				</div>
			</header>
        </>
    )
}

export default SideBar;
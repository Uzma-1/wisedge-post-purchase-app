import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import './assets/css/Style.css';

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import SideBar from "./layout/SideBar";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <section className="main-outer-section">
              <div className="custom-inner-section">
                <SideBar />
                <div className="cstm-main-content-body right-side">
                  <Routes pages={pages} />
                </div>
              </div>
            </section>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}

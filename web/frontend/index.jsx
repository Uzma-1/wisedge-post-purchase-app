import { initI18n } from "./utils/i18nUtils";
import ReactDOM from "react-dom";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from "react-redux";
import Store from "./redux/Store";

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>
  , document.getElementById("app"));
});

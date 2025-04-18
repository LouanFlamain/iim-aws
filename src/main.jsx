import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

import "@aws-amplify/ui-react/styles.css";
import "./index.css";

Amplify.configure(awsExports);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

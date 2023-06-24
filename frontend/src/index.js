import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import ShopContainer from "./components/ShopContainer";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import ItemDetailContainer from "./components/ItemDetailContainer";
import MainContainer from "./components/MainContainer";
import CheckoutContainer from "./components/CheckoutContainer";
import Error from "./components/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <MainContainer />,
      },
      {
        path: "login",
        element: <LogIn />,
      },
      { path: "signup", element: <SignUp /> },
      {
        path: "shop",
        element: <ShopContainer />,
      },
      {
        path: "shop/:pid",
        element: <ItemDetailContainer />,
      },
      {
        path: "checkout/:cid",
        element: <CheckoutContainer />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

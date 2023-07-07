import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import ShopContainer from "./components/ShopContainer";
import { BrowserRouter as Router, Routes,Route} from "react-router-dom";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Animation from "./components/Animation";
import MainContainer from "./components/MainContainer";
import Error from "./components/Error";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import ItemDetailContainer from "./components/ItemDetailContainer";
import CheckoutContainer from "./components/CheckoutContainer";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Animation/>,
      },
      {
        path: "home",
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
    <Router>
      <Routes>
        <Route path="/*" element={<App/>}/>
      </Routes>
    </Router>
    {/* <RouterProvider router={router} /> */}
  </React.StrictMode>
);

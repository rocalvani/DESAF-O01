import { Link, NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
// import CartWidget from "./CartWidget";

const URL =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:8080/users/logout";

const NavBar = () => {
  return (
    <div className="header__left">
      <NavLink to="/cart">{/* <CartWidget /> */}</NavLink>
      <nav className="header__links">
        <ul>
          <li>
            <NavLink to="/home">home</NavLink>
          </li>
          <li>
            <NavLink to="/shop">shop</NavLink>
          </li>
          <li>
            <NavLink onClick={() => {
          let about = document.getElementById("newIn");
          about && about.scrollIntoView({ behavior: "smooth", block: "start" });
        }}>newIn</NavLink>
          </li>
         
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;

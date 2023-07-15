import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
// import CartWidget from "./CartWidget";

const URL =
process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/users/logout";

const NavBar = () => {
  const {user, logged, logOut} = useUser()

  const handleLogOut = async() =>{
  logOut()
  }

  return (
    <div className="header__buttons">
      <NavLink to="/cart">
        {/* <CartWidget /> */}
      </NavLink>
      <nav className="header__links">
        <ul>
          <li>
            <NavLink to="/">
              home
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop">
              shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop/bg">
              cat
            </NavLink>
          </li>
          {logged  ? <li>welcome back {user} <button onClick={handleLogOut}>
              LOG OUT
            </button></li> : <li><NavLink to="/login">
              LOG IN
            </NavLink> OR  <NavLink to="/signup">
              SIGN UP
            </NavLink></li> }
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
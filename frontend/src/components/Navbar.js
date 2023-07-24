import { Link, NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
// import CartWidget from "./CartWidget";

const URL =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:8080/users/logout";

const NavBar = () => {
  const { user, logged, uid, role} = useUser();

  return (
    <div className="header__buttons">
      <NavLink to="/cart">{/* <CartWidget /> */}</NavLink>
      <nav className="header__links">
        <ul>
          <li>
            <NavLink to="/">home</NavLink>
          </li>
          <li>
            <NavLink to="/shop">shop</NavLink>
          </li>
          <li>
            <NavLink to="/shop/bg">cat</NavLink>
          </li>
          {logged ? (
            <li>
              welcome back <Link to={"users/" + uid}>{user}</Link>
              <Link to="logout">LOG OUT</Link>
            </li>
          ) : (
            <li>
              <NavLink to="/login">LOG IN</NavLink> OR
              <NavLink to="/signup">SIGN UP</NavLink>
            </li>
          )}
          {logged && role != "user" ? (
            <li><Link to="admin">administrar productos</Link></li>
          ) : null}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;

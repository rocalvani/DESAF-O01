import { NavLink } from "react-router-dom";
// import CartWidget from "./CartWidget";

const NavBar = () => {
  return (
    <div className="header__buttons">
      <NavLink to="/cart">
        {/* <CartWidget /> */}
      </NavLink>
      <nav className="header__links">
        <ul>
          <li>
            <NavLink to="/">
              <span className="material-icons">&#xe88a;</span> HOME
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop">
              <span className="material-icons">&#xf1cc;</span> SHOP
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop/bg">
              <span className="material-icons">&#xe58e;</span> BGS
            </NavLink>
          </li>
          <li>
            <NavLink to="/login">
              LOG IN
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup">
              SIGN UP
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
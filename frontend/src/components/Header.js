import CartWidget from "./CartWidget";
import NavBar from "./Navbar";
import { Link, NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Header = () => {
  const { user, logged, uid, role} = useUser();

  return (
    <header className="header">
      <NavBar id="gg" />
      <div className="header__img">
        <Link to="/">
          <img src="/img/logo.svg" alt="kpoppies" />
        </Link>
      </div>
      <div className="header__right">
      {logged ? (
            <div className="header__user">
              <span className="header__user--welcome">welcome back <Link to={"users/" + uid}>{user}</Link></span> <CartWidget />
            <span className="header__user--welcome"><Link to="logout">LOG OUT</Link></span>
            </div>
          ) : (
            <div className="header__user--welcome">
              <NavLink to="/login">INGRESAR</NavLink> O <NavLink to="/signup">CREAR UNA CUENTA</NavLink>
            </div>
          )}
          {logged && role != "user" ? (
            <div><Link to="admin">administrar productos</Link></div>
          ) : null}
      </div>

    </header>
  );
};

export default Header;
import CartWidget from "./CartWidget";
import NavBar from "./Navbar";
import { Link, NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  const { user, logged, uid, role} = useUser();

  return (
    <header className="header">
      <NavBar id="gg" />
      <div className="header__img">
        <Link to="/">
          <img src="/img/01logo.svg" alt="uwu" />
        </Link>
      </div>
      <div className="header__right">
      {logged ? (
            <div className="header__user">
              <span className="header__user--welcome">welcome back <Link to={"users/" + uid}>{user}</Link></span> <CartWidget />
              {logged && role != "user" ? (
            <span className="header__user--welcome"><Link to="admin"><FontAwesomeIcon icon={faBars} /></Link></span>
          ) : null}
            <span className="header__user--welcome"><Link to="logout"><FontAwesomeIcon icon={faArrowRightFromBracket} /></Link></span>
            </div>
          ) : (
            <div className="header__user--welcome">
              <NavLink to="/login">INGRESAR</NavLink> O <NavLink to="/signup">CREAR UNA CUENTA</NavLink>
            </div>
          )}
      </div>

    </header>
  );
};

export default Header;
import NavBar from "./Navbar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <NavBar id="gg" />
      <div className="header__img">
        <Link to="/">
          <img src="/img/logo.svg" alt="kpoppies" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
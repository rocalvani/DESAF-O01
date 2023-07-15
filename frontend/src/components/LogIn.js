import axios from "axios";
import { useState } from "react";
import { useUser } from "../context/UserContext";

const LogIn = () => {
  const [email, setEmail] = useState();
  const [password, setPass] = useState();

  const {logIn} = useUser()

  const handleLogIn = (e) => {
    e.preventDefault();
    logIn(email, password)
  };

  return (
    <div className="main__login">
      <h1>Login</h1>
      <form id="loginForm">
        <label>Email</label>
        <input name="email" onChange={(e) => setEmail(e.target.value)} />
        <br />
        <label>Contraseña</label>
        <input name="password" type="password" onChange={(e) => setPass(e.target.value)} />
        <input type="submit" onClick={handleLogIn} />
      </form>
      <p>
        ¿No estás registrado? <a href="/signup">Regístrate aquí</a>
      </p>
      <p>
        o puedes usar <a href="http://localhost:8080/api/sessions/github"> github!</a>
      </p>
      <p>
        Si te olvidaste la contraseña, seguí <a href="/reset">por acá</a>
      </p>
    </div>
  );
};

export default LogIn;

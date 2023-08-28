import { useState } from "react";
import { useUser } from "../context/UserContext";
import { ServerURL } from "../utils";

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
      <div className="main__loginContainer">
      <div className="main__loginContainer--login">

      <h2>Login</h2>
      <form id="loginForm">
        <label>Email</label><br />
        <input name="email" onChange={(e) => setEmail(e.target.value)} />
        <br />
        <label>Contraseña</label><br />
        <input name="password" type="password" onChange={(e) => setPass(e.target.value)} /><br />
        <input type="submit" className="main__button" onClick={handleLogIn} value="Ingresar" />
      </form>
<p><a href="/reset">¿Olvidaste tu contraseña?</a></p></div>
  <div className="main__loginContainer--signup">
  <h2>crear una cuenta</h2>

      <p>
        <a href="/signup"><button>Creá una cuenta desde acá</button></a>
      </p>
      <p>
      <button 
      // onClick={handleGithub}
      ><a href={`${ServerURL}api/sessions/github`}>o puedes usar github!</a></button>
      </p>
  
      </div></div>
    </div>
  );
};

export default LogIn;

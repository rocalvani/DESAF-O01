import { useState } from "react";
import { API } from "../utils";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

const Reset = () =>{
    const [email, setEmail] = useState(); 

    const reset = async(e) => {
        e.preventDefault();
        try {
            let response = await API.post(
                URL + "users/reset",
                JSON.stringify({ email: email }),
                {
                  headers: { "Content-Type": "application/json" },
                  withCredentials: true,
                }
              );

              if (response.status === 201) {
                alert("Te enviamos un mail para dkfgmjkdfgm")
              } 
        } catch (error) {
          alert("este no es un usuario valido")
        }
    }

    return (
        <div className="main__login">
        <div className="main__loginContainer">
<div className="main__loginContainer--registering">
<h2>Reset</h2>
<p className="main__loginContainer--desc">Por favor, dejanos tu mail para que podamos enviarte un link de reestablecimiento.</p>
        <form method="POST">
            <label>email</label>
            <input name="email" onChange={(e) => setEmail(e.target.value)} />
            <button onClick={reset}>reestablecer contraseña</button>
        </form>
</div>
        </div>
    </div>
    )
}

export default Reset
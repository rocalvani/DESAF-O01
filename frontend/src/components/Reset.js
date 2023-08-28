import { useState } from "react";
import { API, ServerURL } from "../utils";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Reset = () =>{
    const [email, setEmail] = useState(); 
    const MySwal = withReactContent(Swal)

    const reset = async(e) => {
        e.preventDefault();
        try {
            let response = await API.post(
                                `${ServerURL}api/users/reset`,
                JSON.stringify({ email: email }),
                {
                  headers: { "Content-Type": "application/json" },
                  withCredentials: true,
                }
              );

              if (response.status === 201) {
                MySwal.fire({
                  title: <strong>Revisá tu mail</strong>,
                  html: <p>Te enviamos un link para poder continuar este proceso.</p>,
                })  
              } 
        } catch (error) {
          MySwal.fire({
            title: <strong>Oops!</strong>,
            html: <p>Hubo un error porque este no es un usuario válido.</p>,
          })  
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
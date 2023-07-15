import { useState } from "react"
import { useParams } from "react-router-dom";
import axios from 'axios'

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

const ResetForm = () =>{

    const [password, setPassword] = useState()
    const token = useParams()

    const handleReset = async(e) => {
        e.preventDefault();
        try {
            let response = await axios.post(
                URL + "users/reset/" + token.rid,
                JSON.stringify({ password }),
                {
                  headers: { "Content-Type": "application/json" },
                  withCredentials: true,
                }
              )

              if (response.status === 200) {
                console.log("cambiada")
                window.location.replace("/login");
              } else {
                console.log("error")
              }
            
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="main__login">
        <h1>Reset</h1>
        <form method="POST">
            <label>nueva contraseña</label>
            <input name="password" onChange={(e) => setPassword(e.target.value)} />
            <input type="submit" onClick={handleReset} />
        </form>
    </div>
    )
}

export default ResetForm
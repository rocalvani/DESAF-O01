import axios from "axios";
import { useState } from "react";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

const Reset = () =>{
    const [email, setEmail] = useState(); 

    const reset = async(e) => {
        e.preventDefault();
        try {
            let response = await axios.post(
                URL + "users/reset",
                JSON.stringify({ email: email }),
                {
                  headers: { "Content-Type": "application/json" },
                  withCredentials: true,
                }
              );
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="main__login">
        <h1>Reset</h1>
        <form method="POST">
            <label>email para enviar link</label>
            <input name="email" onChange={(e) => setEmail(e.target.value)} />
            <input type="submit" onClick={reset} />
        </form>
    </div>
    )
}

export default Reset
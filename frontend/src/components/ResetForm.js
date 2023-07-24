import { useState } from "react"
import { useParams } from "react-router-dom";
import { API, ServerURL } from "../utils";

const ResetForm = () =>{

    const [password, setPassword] = useState()
    const token = useParams()

    const handleReset = async(e) => {
        e.preventDefault();
        // try {
        //     let response = await API.post(
        //         URL + "users/reset/" + token.rid,
        //         JSON.stringify({ password }),
        //         {
        //           headers: { "Content-Type": "application/json" },
        //           withCredentials: true,
        //         }
        //       )

        //       if (response.status === 200) {
        //         console.log("cambiada")
        //         window.location.replace("/login");
        //       } else {
        //         console.log("error")
        //       }
            
        // } catch (error) {
        //     console.log(error)
        // }
    }


    return (
        <div className="main__login">
        <h1>Reset</h1>
        <form method="POST" action={ServerURL + "users/reset/" + token.rid}>
            <label>nueva contraseña</label>
            <input name="password" 
            type="text" 
            // onChange={(e) => setPassword(e.target.value)}
             />
            <input type="submit" onClick={handleReset} />
        </form>
    </div>
    )
}

export default ResetForm
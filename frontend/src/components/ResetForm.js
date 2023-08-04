import { useParams } from "react-router-dom";
import {ServerURL } from "../utils";

const ResetForm = () =>{
    const token = useParams()


    return (
        <div className="main__login">
        <h1>Reset</h1>
        <form method="POST" action={ServerURL + "users/reset/" + token.rid}>
            <label>nueva contraseña</label>
            <input name="password" 
            type="text" 
             />
            <input type="submit"/>
        </form>
    </div>
    )
}

export default ResetForm
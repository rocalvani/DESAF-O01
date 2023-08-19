import { useParams } from "react-router-dom";
import {API, ServerURL } from "../utils";

const ResetForm = () =>{
    const token = useParams()

    const resetPass = async (e) => {
        try {
            e.preventDefault()
            let formData = new FormData(document.getElementById("resetPass"))
            let result = await API.post(`${ServerURL}users/reset/${token.rid}`, formData)
            if (result.status === 200) {
            window.location.replace('/login')
        }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="main__login">
        <div className="main__loginContainer">
            <div className="main__loginContainer--registering">
            <h2>Reset</h2>
        <form method="POST" id="resetPass">
            <label>nueva contraseña</label>
            <input name="password" 
            type="text" 
             />
            <button onClick={resetPass}>cambiar</button>
        </form>
            </div>
        </div>
    </div>
    )
}

export default ResetForm
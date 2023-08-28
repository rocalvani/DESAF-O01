import { useParams } from "react-router-dom";
import {API, ServerURL } from "../utils";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const ResetForm = () =>{
    const token = useParams()
    const MySwal = withReactContent(Swal)

    const resetPass = async (e) => {
        try {
            e.preventDefault()
            let formData = new FormData(document.getElementById("resetPass"))
            let result = await API.post(`${ServerURL}api/users/reset/${token.rid}`, formData)
            console.log(result)
            if (result.status === 201) {
            window.location.replace('/login')
        } 
        } catch (error) {
            MySwal.fire({
                title: <strong>Oops!</strong>,
                html: <p>Esta contraseña no parece ser válida. Quizás deberías probar otra.</p>,
              })  
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
            type="password" 
             />
            <button onClick={resetPass}>cambiar</button>
        </form>
            </div>
        </div>
    </div>
    )
}

export default ResetForm
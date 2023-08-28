import { API, ServerURL } from "../utils";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

  const signup = async(e) =>{
    e.preventDefault();

    try {
    const data = new FormData(document.getElementById('registerForm'));

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
  }
  
    let result = await API.post(`${ServerURL}api/jwt/signup`, data, config)
    if (result.status === 201) {
                window.location.replace('/login');
            }
    } catch (error) {
      MySwal.fire({
        title: <strong>Oops!</strong>,
        html: <p>Este usuario no pudo ser creado. Por favor inténtalo nuevamente.</p>,
      })  
    }
  }



const SignUp = ()=>{

    return(
        <div className="main__login">
   <div className="main__loginContainer">
   <div className="main__loginContainer--registering">
   <h2>Registro</h2>
    <form id="registerForm" method="POST"  encType="multipart/form-data">

        <label>Nombre</label><br/>
        <input type="text" name="first_name"/>
        <br/>
        <label>Apellido</label><br/>
        <input type="text" name="last_name"/>
        <br/>
        <label>Email</label><br/>
        <input type="text" name="email" />
        <br/>
        <label>Edad</label><br/>
        <input type="text" name="age"/>
        <br/>
        <label>Contraseña</label><br/>
        <input type="password" name="password" />

        <input type="file" id="pfp" name="pfp" accept="image/*" />


        <button type="submit" onClick={signup}>registrar</button>
    </form>
   </div>
   </div>
</div>
    )
}

export default SignUp;
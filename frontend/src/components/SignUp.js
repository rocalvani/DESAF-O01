import { useState } from "react";
import { API, ServerURL } from "../utils";


const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

//   const signup = async(e) =>{
//     e.preventDefault();
//     const data = new FormData(document.getElementById('registerForm'));
//     console.log(data);
//     const obj = {};
//     data.forEach((value,key)=>obj[key]=value);
//     console.log("Objeto formado:");
//     console.log(obj);
//     fetch(URL + 'api/jwt/signup',{
//         method:'POST',
//         body:JSON.stringify(obj),
//         headers:{
//             'Content-Type':'application/json'
//         }
//     }).then(result=> {
//         if (result.status === 201) {
//             result.json();
//             alert("Usuario creado con exito!");
//             window.location.replace('/login');
//         }else {
//             alert("No se pudo crear el usuario!");
//         }
//     }).then(
//         json=>console.log(json));
//   }



const SignUp = ()=>{

    return(
        <div className="main__login">
   <div className="main__loginContainer">
   <div className="main__loginContainer--registering">
   <h2>Registro</h2>
    <form id="registerForm" method="POST" action={ServerURL + "api/jwt/signup"}  encType="multipart/form-data">

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


        <button type="submit">registrar</button>
    </form>
   </div>
   </div>
</div>
    )
}

export default SignUp;
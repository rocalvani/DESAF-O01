import { useState } from "react";
import axios from 'axios'


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

    const [first_name, setFirstName] = useState()
    const [last_name, setLastName] = useState()
    const [age, setAge] = useState()
    const [email, setEmail] = useState();
    const [password, setPass] = useState();
  
    const signup = async (e) => {
      e.preventDefault();
      try {
        let response = await axios.post(
          URL + "api/jwt/signup",
          JSON.stringify({ first_name, last_name, age, email, password }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          alert("Registro completo con exito!");
          window.location.replace("/");
        } else if (response.status === 401) {
          alert("Registro erróneo");
        }
      } catch (error) {
        console.log(error);
      }
    };

    return(
        <div className="main__login">
    <h1>Registro</h1>
    <form id="registerForm">

        <label>Nombre</label>
        <input name="first_name" onChange={(e) => setFirstName(e.target.value)}/>
        <br/>
        <label>Apellido</label>
        <input name="last_name" onChange={(e) => setLastName(e.target.value)}/>
        <br/>
        <label>Email</label>
        <input name="email" onChange={(e) => setEmail(e.target.value)}/>
        <br/>
        <label>Edad</label>
        <input name="age" onChange={(e) => setAge(e.target.value)}/>
        <br/>
        <label>Contraseña</label>
        <input name="password" onChange={(e) => setPass(e.target.value)}/>

        <button onClick={signup}>registrar</button>
    </form>
    <p>¿Ya tienes una cuenta? <a href="/login">Ingresa aquí</a></p>
</div>
    )
}

export default SignUp;
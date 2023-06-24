

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

  const signup = async(e) =>{
    e.preventDefault();
    const data = new FormData(document.getElementById('registerForm'));
    console.log(data);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    console.log("Objeto formado:");
    console.log(obj);
    fetch(URL + 'api/jwt/signup',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=> {
        if (result.status === 201) {
            result.json();
            alert("Usuario creado con exito!");
            window.location.replace('/login');
        }else {
            alert("No se pudo crear el usuario!");
        }
    }).then(
        json=>console.log(json));
  }

const SignUp = ()=>{
    return(
        <div>
    <h1>Registro</h1>
    <form id="registerForm">

        <label>Nombre</label>
        <input name="first_name"/>
        <br/>
        <label>Apellido</label>
        <input name="last_name"/>
        <br/>
        <label>Email</label>
        <input name="email"/>
        <br/>
        <label>Edad</label>
        <input name="age"/>
        <br/>
        <label>Contraseña</label>
        <input name="password"/>

        <button onClick={signup}>registrar</button>
    </form>
    <p>¿Ya tienes una cuenta? <a href="/login">Ingresa aquí</a></p>
</div>
    )
}

export default SignUp;
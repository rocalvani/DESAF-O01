

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

  const login = async(e) =>{
    e.preventDefault();
    const data = new FormData(document.getElementById('loginForm'));
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch( URL + 'api/jwt/login',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            result.json()
            .then(json=>{
                alert("Login realizado con exito!");
            });
        } else if (result.status === 401){
            alert("Login invalido revisa tus credenciales!");
        }
    })
    
  }

const LogIn = ()=>{
    return(
        <div>
           <form id="loginForm">
        <label>Email</label>
        <input name="email"></input>
        <br/>
        <label>Contraseña</label>
        <input name="password"></input>
        <button onClick={login}>log in</button>
    </form>
        </div>
    )
}

export default LogIn;
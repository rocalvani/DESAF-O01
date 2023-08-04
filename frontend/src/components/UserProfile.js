import { useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState();
  const [load, setLoad] = useState(false);
  const [role, setRole] = useState();
  const [tickets, setTickets] = useState([])

  const params = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        let response = await API(ServerURL + "users/user/" + params.uid);
        setUser(response.data.user);
        setLoad(true);
        setRole(response.data.role);
        setTickets(response.data.tickets)
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, [params]);

  const premiumUpgrade = async () => {
    try {
      let response = await API.post(ServerURL + "api/users/premium/" + params.uid);
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  if (load) {
    return <div className="main__login">

    <p>{user.name}</p>
    <p>{user.age}</p>
    {user.pfp}
    <br/>
    last seen: {user.last_connection}
    <br/>
    pedidos
    {tickets.map((el) => <p key={el.code}>{el.code}</p>)}

    {role === "premium" && user.role !== "user" ? <button onClick={premiumUpgrade}> convertir a premium</button> : ""}
    
      

    <form id="registerForm" method="POST" action={`${ServerURL}api/users/${params.uid}/edit`}  encType="multipart/form-data">

<label>Nombre</label>
<input type="text" name="first_name"/>
<br/>
<label>Apellido</label>
<input type="text" name="last_name"/>
<br/>
<label>Email</label>
<input type="text" name="email" />
<br/>
<label>Edad</label>
<input type="text" name="age"/>
<br/>
<label>Género</label>
<input type="text" name="gender"/>
<br/>
<label>PFP</label>
<input type="file" id="pfp" name="pfp" accept="image/*" />

<button type="submit">editar</button></form>

<form id="registerForm" method="POST" action={`${ServerURL}api/users/${params.uid}/password`}>

<label>Nueva contraseña</label>
<input type="text" name="newPassword"/>
<br/>
<label>Confirmar la contraseña</label>
<input type="text" name="confirmPassword"/>


<button type="submit">editar</button></form>

<form id="registerForm" method="POST" action={`${ServerURL}api/users/user/documents/${params.uid}`}  encType="multipart/form-data" multiple>
<label>Archivos de identificación</label>
<input type="file" id="thumbnail" name="documents" accept="image/*" multiple />



<button type="submit">editar</button></form>
    </div>
  }
};

export default UserProfile;

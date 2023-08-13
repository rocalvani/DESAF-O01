import { useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState();
  const [load, setLoad] = useState(false);
  const [role, setRole] = useState();
  const [tickets, setTickets] = useState([]);
  const [newPass, setNewPass] = useState();
  const [passConfirmation, setPassConfirmation] = useState();

  const params = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        let response = await API(ServerURL + "users/user/" + params.uid);
        setUser(response.data.user);
        setLoad(true);
        setRole(response.data.role);
        setTickets(response.data.tickets);
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, [params]);

  const premiumUpgrade = async () => {
    try {
      let response = await API.post(
        ServerURL + "api/users/premium/" + params.uid
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const passwordUpdate = async (e) => {
    try {
      e.preventDefault();
      let response = await API.post(
        `${ServerURL}api/users/${params.uid}/password`,
        JSON.stringify({ newPass, passConfirmation })
      );
      if (response.status === 400) {
        alert("Tu nueva contraseña debe ser diferente a la anterior.");
      } else if (response.status === 401) {
        alert("Confirmación de contraseña errónea.");
      } else if (response.status === 201) {
        alert("Tu contraseña fue modificada.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const profileUpdate = async (e) => {
    try {
      e.preventDefault();
      let formData = new FormData(document.getElementById("updateForm"));
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      let result = await API.post(
        `${ServerURL}api/users/${params.uid}/edit`,
        formData,
        config
      );
      if (result.status === 201) {
        alert("¡Tu perfil ha sido actualizado!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (load) {
    return (
      <div className="main__login">
        <p>{user.name}</p>
        <p>{user.age}</p>
        {user.pfp}
        <br />
        last seen: {user.last_connection}
        <br />
        pedidos
        {tickets.map((el) => (
          <p key={el.code}>{el.code}</p>
        ))}
        {role === "premium" && user.role !== "user" ? (
          <button onClick={premiumUpgrade}> convertir a premium</button>
        ) : (
          ""
        )}
        <form id="updateForm" method="POST">
          <label>Nombre</label>
          <input type="text" name="first_name" />
          <br />
          <label>Apellido</label>
          <input type="text" name="last_name" />
          <br />
          <label>Email</label>
          <input type="text" name="email" />
          <br />
          <label>Edad</label>
          <input type="text" name="age" />
          <br />
          <label>Género</label>
          <input type="text" name="gender" />
          <br />
          <label>PFP</label>
          <input type="file" id="pfp" name="pfp" accept="image/*" />

          <button onClick={profileUpdate}>editar</button>
        </form>
        <form>
          <label>Nueva contraseña</label>
          <input
            type="password"
            name="newPassword"
            onChange={(e) => setNewPass(e.target.value)}
          />
          <br />
          <label>Confirmar la contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={(e) => setPassConfirmation(e.target.value)}
          />
          <button onClick={passwordUpdate}>editar</button>
        </form>
        <form
          id="docForm"
          method="POST"
          action={`${ServerURL}api/users/user/documents/${params.uid}`}
          encType="multipart/form-data"
          multiple
        >
          <label>Archivos de identificación</label>
          <input
            type="file"
            id="thumbnail"
            name="documents"
            accept="image/*"
            multiple
          />

          <button type="submit">editar</button>
        </form>
      </div>
    );
  }
};

export default UserProfile;

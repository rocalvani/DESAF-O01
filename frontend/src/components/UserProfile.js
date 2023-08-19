import { useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import { Link, useParams } from "react-router-dom";
import { useWish } from "../context/WishContext";
import {Routes, Route} from "react-router-dom";
import VerticalTabs from "./TabsContainer";


const UserProfile = () => {
  const [user, setUser] = useState();
  const [load, setLoad] = useState(false);
  const [role, setRole] = useState();
  const [tickets, setTickets] = useState([]);
  const [newPass, setNewPass] = useState();
  const [passConfirmation, setPassConfirmation] = useState();
  const [wishlist, setWishlist] = useState([]);

  const params = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        let response = await API(ServerURL + "users/user/" + params.uid);
        let getWish = await API(`${ServerURL}api/wishlist`);
        setUser(response.data.user);
        setRole(response.data.role);
        setTickets(response.data.tickets);
        setWishlist(getWish.data.payload);
        setLoad(true);
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, [user]);

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
      <div className="profile">

     <div className="profile__container">
     <div className="profile__user"> 
     <p>{user.name}</p>
        <p>{user.age}</p>
        <div className="profile__user--pfp">        <img src={`../img/profiles/${user.pfp}`}/>
</div>
        <br />
        last seen: {user.last_connection}
        <br />
        {role === "admin" ? (
          <button onClick={premiumUpgrade}> convertir a premium</button>
        ) : (
          ""
        )}</div>
        <div className="profile__tabs">
        <VerticalTabs wishlist={wishlist} tickets={tickets}/>
        </div>
     </div>

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

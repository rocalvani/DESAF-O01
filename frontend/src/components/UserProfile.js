import { useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import { Link, useParams } from "react-router-dom";
import { useWish } from "../context/WishContext";
import {Routes, Route} from "react-router-dom";
import VerticalTabs from "./TabsContainer";
import { useUser } from "../context/UserContext";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const UserProfile = () => {
  const [user, setUser] = useState();
  const [load, setLoad] = useState(false);
  const [role, setRole] = useState();
  const [tickets, setTickets] = useState([]);
  const [newPass, setNewPass] = useState();
  const [passConfirmation, setPassConfirmation] = useState();
  const [wishlist, setWishlist] = useState([]);
  const [owner, setOwner] = useState()

  const {email} = useUser()
  const params = useParams();
  const MySwal = withReactContent(Swal)

  useEffect(() => {
    const getUser = async () => {
      try {
        let response = await API(ServerURL + "users/user/" + params.uid);
        let getWish = await API(`${ServerURL}api/wishlist`);
      
        setUser(response.data.user);
        setRole(response.data.role);
        setTickets(response.data.tickets);
        setWishlist(getWish.data.payload);
        setOwner(email == response.data.user.email)
        setLoad(true);
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, [user]);

  const premiumUpgrade = async () => {
    try {
      let response = await API.put(
        ServerURL + "api/users/premium/" + params.uid
      );
    } catch (error) {
      if (error.response.status == 405) {
        MySwal.fire({
          title: <strong>Oops!</strong>,
          html: <p>Faltan los archivos requeridos para llevar adelante el cambio de rol.</p>,
        })  
      }
    }
  };


  if (load) {
    return (
      <div className="profile">

     <div className="profile__container">
     <div className="profile__user"> 
     <p className="profile__user--name">{user.name}</p>
        <p>{user.age}</p>
        <br />
        <div className="profile__user--pfp">        <img src={`../img/profiles/${user.pfp}`}/>
</div>
        <br />
        <p className="profile__user--ls"><b>Última vez visto:</b> {user.last_connection}</p>
        <br />
        {role === "admin" ? (
          <button onClick={premiumUpgrade} className="profile__upgrade"> convertir a premium</button>
        ) : (
          ""
        )}</div>
        <div className="profile__tabs">
        <VerticalTabs wishlist={wishlist} tickets={tickets} owner={owner} />
        </div>
     </div>

      </div>
    );
  }
};

export default UserProfile;

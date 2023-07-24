import { useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState();
  const [load, setLoad] = useState(false);
  const [role, setRole] = useState();

  const params = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        let response = await API(ServerURL + "users/user/" + params.uid);
        setUser(response.data.user);
        setLoad(true);
        setRole(response.data.role);
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

    {role === "premium" && user.role != "user" ? <button onClick={premiumUpgrade}> convertir a premium</button> : ""}
    
      
    </div>;
  }
};

export default UserProfile;

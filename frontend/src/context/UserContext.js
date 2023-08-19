import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { API, ServerURL } from "../utils";

const secure = window.location.protocol === 'https'

const userContext = createContext()
const Provider = userContext.Provider

export const useUser = () => {
    const values = useContext(userContext)
    return values;
}

const UserProvider =({children}) =>{

    const [user, setUser] = useState()
    const [userID, setUserID] = useState()
    const [logged, setLogged] = useState(false)
    const [cartID, setCartID] = useState()
    const [role, setRole] = useState()
    const [email, setEmail] = useState()
   
    const [cookies, setCookie, removeCookie] = useCookies();


    const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

  useEffect(() => {
    const onlineData = cookies.onlineUser
      if (onlineData) {
        setCartID(onlineData.cart)
        setUserID(onlineData.uid)
        getOnline()
      }
  }, [logged]);

  const getOnline = async () => {
    try {
      let response = await API(ServerURL + 'users/online')
      await setEmail(response.data.user.email)
        await setUser(response.data.user.name)
        await setRole(response.data.user.role)
        setLogged(true)
          } catch (error) {
      console.log(error)
    }
  }

  const logIn = async (email, password) => {
    try {
      let response = await API.post(
        URL + "api/jwt/login",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        alert("Login realizado con exito!");
        
      await setLogged(true)
      await setUser(response.data.user.name);
      await setCartID(response.data.cart._id)
      await setUserID(response.data.cart.user)
      setCookie("onlineUser", {cart: response.data.cart._id, uid: response.data.cart.user}, {maxAge: 86400})
      window.location.replace('/')

      } else if (response.status === 401) {
        alert("Login invalido revisa tus credenciales!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = async () => {
    try {
        setUser()
        setLogged(false)
        removeCookie("onlineUser")
        let response = await API(URL + "users/logout", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        console.log(response)
        if (response.status === 200) {
          window.location.replace('/')
        }
    } catch (error) {
      console.error(error)
  };
  }


    const values = {
        user: user,
        logged:logged,
        logIn: logIn,
        logOut: logOut,
        cartID: cartID,
        uid: userID,
        role: role,
        email: email,
    }

    return (
        <Provider value={values}>
            {children}
        </Provider>
    )
}

export default UserProvider
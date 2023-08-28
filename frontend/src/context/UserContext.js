import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { API, ServerURL, getHeaders } from "../utils";

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
    const MySwal = withReactContent(Swal)


  useEffect(() => {
    const onlineData = cookies.onlineUser
    const jwt = cookies.jwtCookieToken
    
      if (onlineData) {
        setCartID(onlineData.cart)
        setUserID(onlineData.uid)
        getOnline()
      } else if (jwt) {
        setCartID('64bd8ab0c94a2b42a76767db')
        setUserID('64bd8ab0c94a2b42a76767d7')
        getJWT()
      }
  }, [logged]);

  const getJWT = async () => {
   try {
    let response = await API(ServerURL + 'users/')
  setCartID(response.data.cid)
        setUserID(response.data.uid)
         setEmail(response.data.user.email)
         setUser(response.data.user.name)
        setRole(response.data.user.role)
        setLogged(true)


   } catch (error) {
    console.log(error)
   }
  }

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
        ServerURL + "api/jwt/login",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
      await setLogged(true)
      await setUser(response.data.user.name);
      await setCartID(response.data.cart._id)
      await setUserID(response.data.cart.user)
      setCookie("onlineUser", {cart: response.data.cart._id, uid: response.data.cart.user}, {maxAge: 86400})
      window.location.replace('/home')

      } 
    } catch (error) {
      if (error.response.status === 402) {
        MySwal.fire({
          title: <strong>Oops!</strong>,
          html: <i>Las credenciales que ingresaste son incorrectas.</i>,
        })      }    }
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
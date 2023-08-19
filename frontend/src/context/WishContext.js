import { createContext, useContext, useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import { useUser } from "./UserContext";

const wishContext = createContext()
const Provider = wishContext.Provider


export const useWish = () => {
    const values = useContext(wishContext)
    return values;
}

const WishProvider = ({children}) => {

    const [wish, setWish] = useState()

    const {logged} = useUser()

    useEffect(() => {
        if (logged) {
            getWish()
        }
    }, [wish])


    const getWish = async () => {
        try {
            let getWish = await API(`${ServerURL}api/wishlist`)
            await setWish(getWish.data.payload)
        } catch (error) {
            console.log(error)
        }
    }

    const manageWish = async (pid) => {
        try {
            await getWish()
           let found = await wish.find((el)=> el.product._id === pid)
           if (found) {
            let response = await API.delete(`${ServerURL}api/wishlist/${pid}`)
            if (response.status === 201) {
                alert("Producto borrado de tu lista")
            } else if (response.status === 401){ 
                alert("No está en la lista")
                
            }
        }
           else{ 
            let response = await API.post(`${ServerURL}api/wishlist/${pid}`)
    
            if (response.status === 201) {
                alert("Producto agregado a tu lista")
            } else if (response.status === 401){ 
                alert("ya está sumado")
                
            }
           }




        } catch (error) {
            console.log(error)
        }
    }

    const values = {
        getWish: getWish,
        wish: wish,
        manageWish: manageWish,
    }

return (
    <Provider value={values}>
        {children}
    </Provider>
)
}


export default WishProvider
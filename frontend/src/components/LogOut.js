import { useEffect } from "react";
import { useUser } from "../context/UserContext";

const LogOut = () => {

    const {logOut} = useUser()

    useEffect(() => {
        logOut()
    }, [])

    return (
        <div></div>
    )
}

export default LogOut;
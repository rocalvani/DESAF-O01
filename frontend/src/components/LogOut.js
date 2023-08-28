import { useEffect } from "react";
import { useUser } from "../context/UserContext";

const LogOut = () => {

    const {logOut} = useUser()

    useEffect(() => {
        logOut()
        setTimeout(() => {
            window.location.replace('/')

        }, 1000);
    }, [])

    return (
        <div className="main__login">
<div className="main__login--out">
nos vemos la próxima
</div>
        </div>
    )
}

export default LogOut;
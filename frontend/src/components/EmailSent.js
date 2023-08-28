
import { API, ServerURL } from "../utils"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const EmailSent = () => {

    const params = useParams()
    const [loaded, setLoaded] = useState(false) 

    useEffect(() => {
        const emailPurchase = async() => {
            let result = await API(`${ServerURL}checkout/${params.cid}/purchase`)
        }
        setLoaded(true)
        if (loaded) {
            emailPurchase()
        }
    }, [loaded])

    return (
        <div className="main__login">
<div className="main__login--out">
<h3>Te enviamos un mail sobre tu compra.</h3>
<p>Te recomendamos lo revises en las próximas horas para corroborar que la compra se realizó.</p>
</div>
        </div>
    )
}

export default EmailSent
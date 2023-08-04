
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

    return(
        <div>
            email sent
        </div>
    )
}

export default EmailSent
import { useState } from "react"
import { API, ServerURL } from "../utils"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const FooterContainer = () => {
  const [email, setEmail] = useState()
  const MySwal = withReactContent(Swal)


  const handleSub = async(e) => {
e.preventDefault()
try {
  let result = await API.post(`${ServerURL}subscribe`, {email: email})
if (result.status === 201) {
  MySwal.fire({
    title: <strong>¡Bienvenidx!</strong>,
    html: <p>Próximamente van a llegarte noticias nuestras a tu mail. ¡No las dejes pasar!</p>,
  })  
}
} catch (error) {
  return error
}
}

    return (
        <div id="footer" className="footer">
 <div className="footer__container">
  <div className="footer__contact">
    <h2>
      Suscripción<br/>a newsletter
    </h2>
    <p className="footer__contact--desc">Sumate a nuestra lista para recibir las últimas noticias!</p>
    <form method="POST" className="footer__form" id="subscribe">
      <input type="text" placeholder="email" className="footer__input" onChange={(e) => setEmail(e.target.value)}/>
<button className="footer__submit" onClick={handleSub}>enviar</button>    </form>
    <p>*accede a terminos y condiciones</p>
  </div>
  <div className="footer__sitemap">
    <div className="footer__shop">
      <ul>
        <li>shop all</li>
        <li>skin care</li>
        <li>nail</li>
        <li>collections</li>
      </ul>
    </div>
    <div className="footer__care">
      <ul><li>policy</li>
      <li>terms</li>
      <li>terms</li>
      <li>contact</li></ul>
    </div>
  </div>
 </div>
 <div className="footer__footer">
<div className="footer__copy">
  2023 all rights reserved
</div>
<div className="footer__git">
  github @ rocalvani
</div>
 </div>
</div>
    )
}

export default FooterContainer
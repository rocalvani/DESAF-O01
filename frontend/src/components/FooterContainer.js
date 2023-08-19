const FooterContainer = () => {
    return (
        <div className="footer">
 <div className="footer__container">
  <div className="footer__contact">
    <h2>
      Suscripción a newsletter
    </h2>
    <form action="" className="footer__form">
      <input type="text" placeholder="email" className="footer__input" />
      <input type="submit" value="suscribirse" className="footer__submit"/>
    </form>
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
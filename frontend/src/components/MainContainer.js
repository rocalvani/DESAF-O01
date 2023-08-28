
import MainImg from "./MainImg"
import NewInContainer from "./NewInContainer"

const MainContainer = () =>{

    return (
            <div className="main">
            <MainImg />
            <NewInContainer />
            <div className="collections" id="collections">
                
<div className="main__collections">
<div className="main__collections--card">
<h2>colecciones</h2>
<p>Aunque por ahora no son muchas, esperamos nuestro sitio crezca junto a vos. Pero, por ahora, te mostramos nuestras categorías actuales para que las descubras cuando quieras.</p>
</div>


<div className="main__collections--card">
<a href="/shop?category=nail polish"><img src="../../img/np01.jpeg" className="cover"/>
<h3>nail polish</h3></a>
</div>

<div className="main__collections--card">
<a href="/shop?category=skincare"><img src="../../img/sk01.jpeg" className="cover"/>
<h3>skincare</h3></a>

</div>

</div>

            </div>
            <div className="main__photo"></div>
        </div>
    )
}

export default MainContainer
import { React, useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import Item from "./Item";
import { Link } from "react-router-dom";


const NewInContainer = () => {
    const [shop, setShop] = useState([]);
  const [load, setLoad] = useState(false)

    
    useEffect(() => {
        const getNew = async () => {
            let result = await API(`${ServerURL}shop/tag/new`)
            setShop(result.data.products)
                setLoad(true)
        }
        getNew()
    }, [load])

    if (load) {
        return (
            <div id="newIn" className="main__newin">
                <h2>New collection</h2>
                <div className="main__newin--container">
                {shop.map((el) => {
                return <Item key={el._id} product={el} />;
              })}
              <div className="desc02">
<p>                Esto es algo de lo nuevo que tenemos en el store como parte de nuestra colección de película.
</p>
                <Link to="/shop">Accedé al shop completo</Link>

              </div>
                    </div></div>
        )
    }
}

export default NewInContainer
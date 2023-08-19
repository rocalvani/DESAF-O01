import { React, useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import Item from "./Item";


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
                    </div></div>
        )
    }
}

export default NewInContainer
import { useWish } from "../context/WishContext"

const LikeItemButton = (props) => {


    const {manageWish} = useWish()

  const handleAdd =() => {
manageWish(props.pid)  }


    return ( 
        <button
            className="LikeButton"
            onClick={handleAdd}
          >
            {props.stat}
          </button>
    )
}

export default LikeItemButton;
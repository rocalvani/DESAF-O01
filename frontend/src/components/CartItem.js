const CartItem = (el) => {
    console.log(el)
    return (
        <div>
            nombre:
            {el.product.title}
        </div>
    )
}

export default CartItem
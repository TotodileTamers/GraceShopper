import React from "react";
import { connect } from "react-redux";
import { getCart, deleteFromCart, updateCart, editCartItem } from "../store/cart";


class Cart extends React.Component {
  constructor() {
    super();
    // ADDED ON BRANCH "feature/RENDER-GUEST-CART"
    this.state = { guestCartArray: [] };
    this.handleCheckout = this.handleCheckout.bind(this);
    this.handleGuestDelete = this.handleGuestDelete.bind(this);
  }

  // ADDED ON BRANCH "feature/RENDER-GUEST-CART"
  async componentDidMount() {
    let guestCart = window.localStorage.getItem("cart");
    if (guestCart) {
      const guestCartArray = JSON.parse(guestCart);
      await this.setState({ guestCartArray });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId != this.props.userId)
      this.props.getCart(this.props.userId);
  }
  handleCheckout() {
    if (!this.props.cart.fulfilled) {
      this.props.updateCart({
        ...this.props.cart,
        fulfilled: !this.props.cart.fulfilled,
      });
    }
  }

  // ADDED ON BRANCH "feature/RENDER-GUEST-CART"
  async handleGuestDelete(productId) {
    // created updated array, removing the chosen product
    let guestCartArray = this.state.guestCartArray.filter((item) => {
      return item.productId !== productId;
    });
    // update local state with this new array, so it re-renders
    await this.setState({ guestCartArray });
    // and update the localStorage
    let stringifiedCartArray = JSON.stringify(guestCartArray);
    window.localStorage.setItem("cart", stringifiedCartArray);
  }

  render() {
    let renderedDiv;
    const { cart, userId,handleCheckout } = this.props;
    if (userId) {
      if (cart.length) {
        renderedDiv = (
          <div>
            {cart.map((cartItem) => {
              return (
                <div key={cartItem.id}>
                  <h3>{cartItem.name}</h3>
                  <ul>Product Id: {cartItem.productId}</ul>
                  <ul>Quantity: {cartItem.quantity}</ul>
                  <ul>Price: {cartItem.price}</ul>

                  <button
                    onClick={() => {
                      this.props.deleteFromCart(userId, cartItem.id);
                    }}
                  >
                    Delete Item
                  </button>
                  <button
                    onClick={() => {
                      cartItem.quantity++;
                      this.props.editCartItem(userId, cartItem);
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => {
                      if (cartItem.quantity > 1) {
                        cartItem.quantity--;
                        this.props.editCartItem(userId, cartItem);
                      } else {
                        this.props.deleteFromCart(userId, cartItem.id);
                      }
                    }}
                  >
                    -
                  </button>
                </div>
              );
            })}
            {/* <Link to="/confirmation"> */}
            <button onClick={handleCheckout}>Checkout</button>
            {/* </Link> */}
          </div>
        );
      } else renderedDiv = <div>Cart is Empty!</div>;
    } else {
      // window.localStorage.removeItem("cart");
      let guestCart = window.localStorage.getItem("cart");
      if (guestCart) {
        const guestCartArray = JSON.parse(guestCart);

        renderedDiv = <div>User is not Logged in!</div>;
      if (this.state.guestCartArray.length) {
        renderedDiv = (
          <div>
            Here is your guest cart!
            {this.state.guestCartArray.map((cartItem) => {
              return (
                <div key={cartItem.productId}>
                  <h3>{cartItem.name}</h3>
                  <img src={cartItem.image} height="150px" width="150px" />
                  <ul>Product Id: {cartItem.productId}</ul>
                  <ul>Quantity: {cartItem.quantity}</ul>
                  <ul>Price: $ {cartItem.price / 100}</ul>
                  <button
                    onClick={() => this.handleGuestDelete(cartItem.productId)}
                  >
                    Delete Item
                  </button>
                </div>
              );
            })}
          </div>
        );
      } else {
        renderedDiv = <div>cart is empty</div>;
      }
    }

    return renderedDiv;
  }
}

const mapState = (state) => {
  return {
    userId: state.auth.id,
    cart: state.cart,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getCart: (id) => dispatch(getCart(id)),
    deleteFromCart: (userId, itemId) =>
      dispatch(deleteFromCart(userId, itemId)),
    updateCart: (cart) => dispatch(updateCart(cart)),
    editCartItem: (userId, cartItem) =>
      dispatch(editCartItem(userId, cartItem)),
  };
};

export default connect(mapState, mapDispatch)(Cart);

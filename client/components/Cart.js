import React from 'react';
import { connect } from 'react-redux';

import {
  getCart,
  deleteFromCart,
  editCartItem,
  updateCart,
} from '../store/cart';

import { Link } from 'react-router-dom';

class Cart extends React.Component {
  constructor() {
    super();
    this.state = { guestCartArray: [], total: 0 };
    this.handleGuestDelete = this.handleGuestDelete.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.handleGuestChangeQty = this.handleGuestChangeQty.bind(this);
  }

  async componentDidMount() {
    let guestCart = window.localStorage.getItem('cart');
    if (guestCart) {
      const guestCartArray = JSON.parse(guestCart);
      this.setState({ guestCartArray });
    }
    if (this.props.userId) {
      this.props.getCart(this.props.userId);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId != this.props.userId)
      this.props.getCart(this.props.userId);
  }

  handleCheckout() {
    this.props.updateCart(this.props.userId);
  }

  async handleGuestDelete(productId) {
    // created updated array, removing the chosen product
    let guestCartArray = this.state.guestCartArray.filter((item) => {
      return item.productId !== productId;
    });
    // update local state with this new array, so it re-renders
    await this.setState({ guestCartArray });
    // and update the localStorage
    let stringifiedCartArray = JSON.stringify(guestCartArray);
    window.localStorage.setItem('cart', stringifiedCartArray);
  }

  // ADDED with branch 'feature/top-off-guest-cart'
  async handleGuestChangeQty(productId, method) {
    // created updated array: inc or dec quantity property of specified product
    let guestCartArray = this.state.guestCartArray.filter((item) => {
      if (item.productId === productId) {
        if (method === 'increase') item.quantity++;
        if (method === 'decrease' && item.quantity > 0) item.quantity--;
      }
      // This filtered array only returns items whose quantity is still > 0
      // so if a customer decreases quantity to zero, item is dropped from cart
      return item.quantity > 0;
    });
    // update local state with this new array, so it re-renders
    await this.setState({ guestCartArray });
    // and update the localStorage
    let stringifiedCartArray = JSON.stringify(guestCartArray);
    window.localStorage.setItem('cart', stringifiedCartArray);
  }

  render() {
    let renderedDiv;
    const { cart, userId } = this.props;
    if (userId) {
      if (cart.length) {
        renderedDiv = (
          <div>
            {cart.map((cartItem) => {
              this.state.total += cartItem.price;
              return (
                <div key={cartItem.id}>
                  <h3>{cartItem.name}</h3>
                  <Link to={`/products/${cartItem.productId}`}>
                    <img src={cartItem.imageURL} height="150px" width="150px" />
                  </Link>
                  <ul>Quantity: {cartItem.quantity}</ul>
                  <ul>Price: ${cartItem.price / 100}</ul>
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
            <h3>Total: ${this.state.total / 100}</h3>

            <Link to="/confirmation">
              <button onClick={() => this.handleCheckout()}>Checkout</button>
            </Link>
          </div>
        );
      } else renderedDiv = <div>Cart is Empty!</div>;
    } else {
      if (this.state.guestCartArray.length) {
        renderedDiv = (
          <div>
            Here is your guest cart!
            {this.state.guestCartArray.map((cartItem) => {
              this.state.total += cartItem.price;
              return (
                <div key={cartItem.productId}>
                  <Link to={`/products/${cartItem.productId}`}>
                    <h3>{cartItem.name}</h3>
                  </Link>
                  <img src={cartItem.image} height="150px" width="150px" />
                  <ul>Product Id: {cartItem.productId}</ul>
                  <ul>Quantity: {cartItem.quantity}</ul>
                  <ul>Price: ${cartItem.price / 100}</ul>
                  <button
                    onClick={() => this.handleGuestDelete(cartItem.productId)}
                  >
                    Delete Item
                  </button>
                  <button
                    onClick={() =>
                      this.handleGuestChangeQty(cartItem.productId, 'increase')
                    }
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      this.handleGuestChangeQty(cartItem.productId, 'decrease')
                    }
                  >
                    -
                  </button>
                </div>
              );
            })}
            <h3>Total: ${this.state.total / 100}</h3>
          </div>
        );
      } else {
        renderedDiv = (
          <div>
            <br></br>
            <br></br>
            <h2>
              Your Guest Cart is empty! Take a look at all of our luxurious{' '}
              <Link to="/products">Products</Link> !
            </h2>
            <br></br>
            <br></br>
          </div>
        );
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
    editCartItem: (userId, cartItem) =>
      dispatch(editCartItem(userId, cartItem)),
    updateCart: (id) => dispatch(updateCart(id)),
  };
};

export default connect(mapState, mapDispatch)(Cart);

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

const Navbar = ({ handleClick, isLoggedIn, isAdmin, username }) => (
  <header className='header'>
    <Link to='/home'>
      <img
        className='logo-img'
        alt='logo'
        src='https://cdn.shopify.com/s/files/1/0012/8660/2848/files/logo-horizontal_190x.png?v=1546919365'
      />
    </Link>
    <nav className='main-nav'>
      {isLoggedIn ? (
        <ul className='main-nav-list'>
          {/* The navbar will show these links after you log in */}
          <li>
            <h3 className='welcome'>
              Welcome, {username ? username : 'Guest!'}
            </h3>
          </li>
          <li>
            <Link className='main-nav-link' to='/products'>
              Shop
            </Link>
          </li>
          {isAdmin ? (
            <li>
              <Link className='main-nav-link' to='/users'>
                Users Info
              </Link>
            </li>
          ) : (
            ''
          )}
          <li>
            <Link className='main-nav-link' to='/cart'>
              <span className='material-icons-outlined'>shopping_bag</span>
            </Link>
          </li>
          <li>
            <a className='main-nav-link' href='#' onClick={handleClick}>
              Logout
            </a>
          </li>
        </ul>
      ) : (
        <ul className='main-nav-list'>
          {/* The navbar will show these links before you log in */}
          <Link className='main-nav-link' to='/products'>
            Shop
          </Link>
          <Link className='main-nav-link cart-logo' to='/cart'>
            <span id='cart' className='material-icons-outlined'>
              shopping_bag
            </span>
          </Link>
          <Link className='main-nav-link' to='/login'>
            Login
          </Link>
          <Link className='main-nav-link' to='/signup'>
            Sign Up
          </Link>
        </ul>
      )}
    </nav>
  </header>
);

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    isAdmin: state.auth.isAdmin,
    username: state.auth.username,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);

import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios_api from './API/axios';
import './App.css';

// Import Assets
import mainlogo from './assets/Images/mainlogo.png';

// Import Components
import Home from './components/Home';
import MainPage from './components/MainPage';
import SearchingItem from './components/filter_item/Searching_item';
import NewBook from './components/book_menu/NewBook';
import DiscountBooks from './components/Main_Home_page/Discount';
import Login from './components/Accounts/login_acc';
import Signup from './components/Accounts/Register_acc';
import UserProfile from './components/Accounts/Account';
import Wishlist from './components/Wishlist';
import ShoppingCart from './components/ShoppingCard';
import ViewBook from './components/ViewBook';
import Authors from './components/Authors';
import Footer from './components/Footer';
import Category from './components/Categories/Category';
import SearchResults from './components/Searching/Searching_book';
import MenuItem from './components/MenuItem';
import FeaturedAuthors from './components/Authors/FeatureAuther';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem('userID');

  // Fetch Cart Data
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const response = await axios_api.get(`/cart/${userId}`);
        setCartItems(response.data.cartItems);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    fetchCart();
  }, [userId]);

  // Calculate Total Cart Items
  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Router>
      {/* Navigation Bar */}
      <div className="navbar">
        <div className="logoapp">
          <NavLink to="/">
            <img src={mainlogo} alt="Main Logo" />
          </NavLink>
        </div>
        <SearchingItem />
        <div className="item_menu">
          <ul>
            <li>
              <i className="fa-solid fa-user"></i>
              <NavLink to="/account" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                Account
              </NavLink>
            </li>
            <li>
              <i className="fa-regular fa-heart"></i>
              <NavLink to="/wishlist" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                Wishlist
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <div className="count">{calculateTotalItems()}</div>
                <i className="fa-solid fa-cart-shopping"></i>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Menu Section */}
      <MenuItem />

      {/* Main Content */}
      <div className="body_item">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/newbook" element={<NewBook />} />
          <Route path="/account" element={<UserProfile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/Author/:id" element={<Authors />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/book/:id" element={<ViewBook />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/discount" element={<DiscountBooks />} />
          <Route path="/featureauthor" element={<FeaturedAuthors />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </Router>
  );
};

export default App;
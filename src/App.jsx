import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios_api from './API/axios';
import './App.css';
import { CartProvider } from './components/Contexts/CartContext.jsx';
import { FavoriteProvider } from './components/Contexts/FavoriteContext.jsx';
import mainlogo from './assets/Images/mainlogo.png';
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
import Best_seller from './components/Main_Home_page/Best_seller.jsx';
import Recommendations from './components/Recommend_book.jsx';
import SubCategories from '../src/components/Categories/SubCategories.jsx'
import ChangeInfor from "./components/Accounts/ChangeInfor.jsx"
import { AppBar, Toolbar, Box, Stack, Typography, Badge, IconButton, useMediaQuery } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem('userID');
  const [showSearch, setShowSearch] = useState(false);
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
  const isMobile = useMediaQuery('(max-width:600px)');    // Check if the screen is mobile

  // Calculate Total Cart Items
  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Router>
      <CartProvider>
        <FavoriteProvider>

          <AppBar position="sticky" sx={{ backgroundColor: 'red', px: 1 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NavLink to="/">
                  <Box
                    component="img"
                    src={mainlogo}  // Your logo source
                    alt="Main Logo"
                    sx={{ height: 50, width: 'auto' }}
                  />
                </NavLink>
              </Box>
              <Box sx={{ flex: 1, maxWidth: 600, display: { xs: 'none', sm: 'block' } }}>
                {!isMobile && <SearchingItem />}
              </Box>
              
              <Stack direction="row" spacing={2} alignItems="center">
              {isMobile && showSearch && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SearchingItem />
                  <IconButton onClick={() => setShowSearch(false)}>
                    <SearchIcon sx={{ color: 'white' }} />
                  </IconButton>
                </Box>
              )}
                {isMobile && !showSearch && (
                  <IconButton onClick={() => setShowSearch(true)}>
                    <SearchIcon sx={{ color: 'white' }} />
                  </IconButton>
                )}
                <NavLink
                  to="/account"
                  style={({ isActive }) => ({
                    color: 'white',
                    textDecoration: isActive ? 'underline' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  })}
                >
                  <AccountCircleIcon />
                  {/* Hide the name on mobile */}
                  {!isMobile && <Typography variant="body2">Account</Typography>}
                </NavLink>

                <NavLink
                  to="/wishlist"
                  style={({ isActive }) => ({
                    color: 'white',
                    textDecoration: isActive ? 'underline' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  })}
                >
                  <FavoriteBorderIcon />
                  {/* Hide the name on mobile */}
                  {!isMobile && <Typography variant="body2">Wishlist</Typography>}
                </NavLink>

                <NavLink
                  to="/cart"
                  style={({ isActive }) => ({
                    color: 'white',
                    textDecoration: isActive ? 'underline' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    position: 'relative',
                  })}
                >
                  <Badge badgeContent={calculateTotalItems()} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </NavLink>
              </Stack>
            </Toolbar>
          </AppBar>

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
              <Route path="/subcategories/:id/books" element={<SubCategories />} />
              <Route path="/book/:id" element={<ViewBook />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/discount" element={<DiscountBooks />} />
              <Route path="/featureauthor" element={<FeaturedAuthors />} />
              <Route path="/BestSeller" element={<Best_seller />} />
              <Route path="/recomment_book" element={<Recommendations />} />
              <Route path="/ChangeInfor" element={<ChangeInfor />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>

          {/* Footer */}
          <Footer />
        </FavoriteProvider>
      </CartProvider>

    </Router>
  );
};

export default App;
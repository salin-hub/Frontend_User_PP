import { useEffect, useState } from 'react';
import axios_api from '../../API/axios'; // Import your Axios instance
import { useNavigate } from 'react-router-dom';
import Account from '../../assets/Images/account.png';
import Exit from '../../assets/Images/exit.png';
import Book from '../../assets/Images/bookmark_red.png';
import Changepassword from "../../assets/Images/reset-password.png"
import OrderList from "../../assets/Images/manifest.png"
import '../../assets/style/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null); // State for user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [orders, setOrders] = useState([]); // State for orders
  const navigate = useNavigate();
  const userId = localStorage.getItem('userID');

  // Fetch orders by user ID
  const fetchOrders = async (userId) => {
    try {
      setLoading(true);
      const response = await axios_api.get(`/users/${userId}/orders`);
      setOrders(response.data.orders);

    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // If token is not available in localStorage, consider user already logged out
        return navigate('/login');
      }
  
      // Send logout request to the server
      await axios_api.post(
        '/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
  
      // Clear localStorage after successful logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('Role');
      localStorage.removeItem('userID'); // Clear user-specific data
  
      // Redirect to login page after successful logout
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };
  const handleClickchangeinfor =()=>{
    navigate('/ChangeInfor', { state: { email: user?.email } });
  }
  const handleClickmywishlist =()=>{
    navigate('/wishlist')
  }
  

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No token found, please log in.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await axios_api.get('/account', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred.');
        setLoading(false);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  // Fetch data on mount
  useEffect(() => {
    if (userId) {
      fetchOrders(userId);
    } else {
      setError('User ID is missing.');
      navigate('/login');
    }
  }, [userId, navigate]);

  // Render loading state
  if (loading) {
    return (
      <div className="loading_account">
        <div className="loading_spinner"></div>
        <p>Loading your account details...</p>
      </div>
    );
  }

  // Render error state
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="Books">
        <div className="Name_menu">
          <h1>Account</h1>
        </div>
      </div>
      <div className="controller_profile">
        <div className="user-profile">
          <div className="profile-section">
            <div className="profile-image">
              <img src={Account} alt="User Profile" />
            </div>
            <div className="profile-info">
              <p>{user?.name}</p>
              <p>{user?.email}</p>
            </div>
            <button
              className="sign-out"
              onClick={handleLogout}
            >
              <div className="signout_img">
                <img src={Exit} alt="Sign Out" />
              </div>
              Sign out
            </button>
          </div>

          <div className="menu-section">
            <div className="control_menu">
              <div className="menu-item">
                <div className="icon">
                  <img src={OrderList} alt="Reading History" />
                </div>
                <p>My Order</p>
              </div>
              <div className="menu-item" onClick={handleClickmywishlist}>
                <div className="icon">
                  <img src={Book} alt="My Orders" />
                </div>
                <p>My Wishlists</p>
              </div>
              <div className="menu-item" onClick={handleClickchangeinfor}>
                <div className="icon">
                  <img src={Changepassword} alt="My Orders" />
                </div>
                <p>Change password</p>
              </div>
            </div>
            <div className="order_list">
              <div className="Books" style={{ zIndex: 0 }}>
                <div className="Name_menu">
                  <h1>Order lists</h1>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Order #</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Title</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Items</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Discount</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Total</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Placed On</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Message</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    order.items.map((item, itemIndex) => (
                      <tr key={`${index}-${itemIndex}`} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '10px' }}>{itemIndex+1|| 'N/A'}</td>
                        <td style={{ padding: '10px' }}>
                          {item.book?.title || 'No title available'}
                        </td>
                        <td style={{ padding: '10px' }}>
                          {item.quantity || 'No title available'}
                        </td>
                        <td style={{padding:'10px',color:"red"}}>{item.discount_percentage}%</td>
                        <td style={{ padding: '10px' }}>
                          ${item.calculated_price || 'No price available'}
                        </td>
                        <td style={{ padding: '10px' }}>
                          {new Date(order.created_at).toLocaleDateString('en-GB')}
                        </td>
                        <td style={{ padding: '10px' }}>
                          {item.message}
                        </td>
                        <td style={{ padding: '10px' }}>
                          {item.status || 'No message available'}
                        </td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

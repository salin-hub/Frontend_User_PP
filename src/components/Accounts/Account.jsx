import { useEffect, useState } from 'react';
import axios_api from '../../API/axios'; // Import your Axios instance
import { useNavigate } from 'react-router-dom';
import Account from '../../assets/Images/account.png';
import Exit from '../../assets/Images/exit.png';
import Book from '../../assets/Images/open-book.png';
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
              onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('Role');
                navigate('/login');
              }}
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
                  <img src={Book} alt="Reading History" />
                </div>
                <p>Reading History</p>
              </div>
              <div className="menu-item">
                <div className="icon">
                  <img src={Book} alt="My Orders" />
                </div>
                <p>My Orders</p>
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
                        <td style={{ padding: '10px' }}>{item.id || 'N/A'}</td>
                        <td style={{ padding: '10px' }}>
                          {item.book?.title || 'No title available'}
                        </td>
                        <td style={{ padding: '10px' }}>
                          {item.quantity || 'No title available'}
                        </td>
                        <td style={{ padding: '10px' }}>
                          ${item.price || 'No price available'}
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

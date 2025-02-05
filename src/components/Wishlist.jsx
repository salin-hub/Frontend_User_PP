import { useState, useEffect } from 'react';
import '../assets/style/Wishlist.css';
import cart from '../assets/Images/cart.png';
import Delete from '../assets/Images/Delete.png';
import axios_api from '../API/axios';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
const Wishlist = () => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const userID = localStorage.getItem('userID');
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const items_favorite = async (userID) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios_api.get(`/favorites/${userID}`);
            setItems(response.data[1] || []); // Ensure correct structure
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError('Failed to load favorites. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const deleteFavorite = async (bookId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken || !userID) {
                alert('User is not authenticated or user ID is missing.');
                return;
            }

            const requestData = {
                books_id: bookId,
                users_id: userID,
            };

            const response = await axios_api.delete('/favorite', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                data: requestData,
            });

            alert(response.data.message);

            // Update the state to remove the deleted favorite
            setItems((prevItems) => prevItems.filter((item) => item.book.id !== bookId));
        } catch (error) {
            console.error('Error deleting favorite:', error);
            alert('An error occurred while removing from favorites.');
        }
    };

    const handleAddToCart = async (bookId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');
            const quantity = 1;

            if (!authToken || !userId) {
                alert('User is not authenticated or user ID is missing.');
                return;
            }

            const requestData = {
                book_id: bookId,
                user_id: userId,
                quantity: quantity,
            };

            const response = await axios_api.post('/cart', requestData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                setSuccessMessage('Book added to cart successfully!');
                setSnackbarOpen(true);
            } else {
                alert('Failed to add book to cart. Please try again.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert(error.response?.data?.message || 'An error occurred while adding to the cart.');
        }
    };
    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (userID) {
            items_favorite(userID);
        }
    }, [userID]);

    return (
        <>
            {error && <div>Error: {error}</div>}

            {successMessage && (
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000} // Auto hide after 6 seconds
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleSnackbarClose} severity="success" className="Snackbar">
                        {successMessage}
                    </Alert>
                </Snackbar>
            )}

            <div className="Books">
                <div className="Name_menu">
                    <h1>Wishlist Book</h1>
                </div>
            </div>

            {loading && <LinearProgress sx={{ marginBottom: '20px' }} />}

            <div className="wishlist">
                {items.length === 0 && !loading && !error && (
                    <div className="empty-wishlist">
                        <h2>Your wishlist is empty!</h2>
                        <p>Browse books and add them to your wishlist.</p>
                    </div>
                )}
                <div className="item_books">
                    {items.map((item, index) => (
                        <div key={index} className="items" onClick={() => handleBookClick(item.id)} style={{ cursor: 'pointer' }}>
                            <div className="book_item">
                                <img
                                    src={item.book.cover_path}
                                    alt={item.book.title}
                                />
                            </div>
                            <div className="descript_item">
                                <h1>{item.book.title}</h1>
                                <p>{item.book.description}</p>
                                <div className="price">
                                    <span>{item.book.price_handbook}</span>
                                </div>
                                <div className="buy_item">
                                    <div className="buy" onClick={() => handleAddToCart(item.book.id)}>
                                        <img src={cart} alt="Cart" />
                                        <span>Cart</span>
                                    </div>
                                    <img
                                        src={Delete}
                                        alt="Delete"
                                        onClick={() => deleteFavorite(item.book.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Wishlist;

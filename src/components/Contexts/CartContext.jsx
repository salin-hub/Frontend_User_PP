import { createContext, useState, useContext } from 'react';
import axios_api from '../../API/axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleAddToCart = async (bookId) => {
        try {
            setLoading(true);
            setError(null);
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');

            if (!authToken || !userId) {
                navigate('/login'); 
                return;
            }

            const requestData = {
                book_id: bookId,
                user_id: userId,
                quantity: 1,
            };

            const response = await axios_api.post('/cart', requestData, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (response.status === 200) {
                setSuccessMessage('Book added to cart successfully!');
                setSnackbarOpen(true);
                setCartItems((prev) => [...prev, bookId]);
            } else {
                setError('Failed to add book to cart. Please try again.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <CartContext.Provider value={{ handleAddToCart, cartItems, successMessage }}>
            {loading && <LinearProgress />} {/* Show loading indicator */}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Show error if exists */}

            {children}

            {successMessage && (
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={2000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{marginTop: "40px"}}
                >
                    <Alert onClose={handleSnackbarClose} severity="success">
                        {successMessage}
                    </Alert>
                </Snackbar>
            )}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export const useCart = () => useContext(CartContext);

import { createContext, useState, useContext } from 'react';
import axios_api from '../../API/axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';

const FavoriContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const navigate = useNavigate();
    const [favoriteBooks, setFavoriteBooks] = useState({}); // Use object for favoriteBooks
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleFavorite = async (bookId) => {
        try {
            setLoading(true);
            setError(null);
    
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');
    
            if (!authToken || !userId) {
                alert('User is not authenticated or user ID is missing.');
                navigate('/login');
                return;
            }
    
            const requestData = {
                books_id: bookId,
                users_id: userId,
            };
    
            const response = await axios_api.post('/favorite', requestData, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
    
            if (response.status === 200) {
                setSuccessMessage('Book added to favorites successfully!');
                setSnackbarOpen(true);
                setFavoriteBooks((prev) => ({ ...prev, [bookId]: true })); // Mark as favorite
            } else {
                setError('Failed to add book to favorites. Please try again.');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
            setError('An error occurred while adding to favorites.');
        } finally {
            setLoading(false);
        }
    };
    

    const fetchFavoriteBooks = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');
            if (!authToken || !userId) return;

            const response = await axios_api.get(`/user/${userId}/favorites`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            const favorites = response.data.favorites;
            const favoriteMap = favorites.reduce((map, book) => {
                map[book.books_id] = true;
                return map;
            }, {});
            setFavoriteBooks(favoriteMap);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const deleteFavorite = async (bookId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');

            if (!authToken || !userId) {
                alert('User is not authenticated or user ID is missing.');
                return;
            }

            const requestData = {
                books_id: bookId,
                users_id: userId,
            };

            await axios_api.delete('/favorite', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                data: requestData,
            });

            setFavoriteBooks((prev) => ({ ...prev, [bookId]: false }));
        } catch (error) {
            console.error('Error deleting favorite:', error);
            alert('An error occurred while removing from favorites.');
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <FavoriContext.Provider value={{ handleFavorite, favoriteBooks, deleteFavorite, fetchFavoriteBooks }}>
            {loading && <LinearProgress />}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {children}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ marginTop: '40px' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
        </FavoriContext.Provider>
    );
};

FavoriteProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useFavorite = () => useContext(FavoriContext);

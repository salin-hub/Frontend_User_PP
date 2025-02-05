import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cart from '../assets/Images/cart.png';
import axios_api from '../API/axios';
import markbookIcon from '../assets/Images/bookmark.png';
import markbookIcon_red from '../assets/Images/bookmark_red.png';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Other_book = () => {
    const [items, setItems] = useState([]); // Store most favorited books
    const [favoriteBooks, setFavoriteBooks] = useState({}); // Store favorite status
    const [loading, setLoading] = useState(true); // Add loading state
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch most favorited books
    const items_favorite = async () => {
        try {
            const response = await axios_api.get('/most_favorite');
            setItems(response.data.data);
        } catch (err) {
            console.error('Error fetching favorites:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the user's favorite books
    const fetchFavoriteBooks = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');
            if (!authToken || !userId) return;

            const response = await axios_api.get(`/user/${userId}/favorites`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
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

    // Add a book to favorites
    const handleFavorite = async (bookId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');

            if (!authToken || !userId) {
                alert('User is not authenticated or user ID is missing.');
                return;
            }

            const requestData = { books_id: bookId, users_id: userId };

            const response = await axios_api.post('/favorite', requestData, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            setSuccessMessage(response.data.message);
            setSnackbarOpen(true);
            setFavoriteBooks((prev) => ({ ...prev, [bookId]: true }));
        } catch (error) {
            console.error('Error adding to favorites:', error);
            alert('An error occurred while adding to favorites.');
        }
    };

    // Remove a book from favorites
    const deleteFavorite = async (bookId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');

            if (!authToken || !userId) {
                alert('User is not authenticated or user ID is missing.');
                return;
            }

            const requestData = { books_id: bookId, users_id: userId };

            const response = await axios_api.delete('/favorite', {
                headers: { Authorization: `Bearer ${authToken}` },
                data: requestData,
            });

            setSuccessMessage(response.data.message);
            setSnackbarOpen(true);
            setFavoriteBooks((prev) => ({ ...prev, [bookId]: false }));
        } catch (error) {
            console.error('Error deleting favorite:', error);
            alert('An error occurred while removing from favorites.');
        }
    };

    // Add book to cart
    const handleAddToCart = async (bookId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');
            const quantity = 1;

            if (!authToken || !userId) {
                alert('User is not authenticated or user ID is missing.');
                return;
            }

            const requestData = { book_id: bookId, user_id: userId, quantity };

           await axios_api.post('/cart', requestData, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            setSuccessMessage('Book added to cart successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred while adding to the cart.');
        }
    };

    // Snackbar close handler
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Fetch data on mount
    useEffect(() => {
        items_favorite();
        fetchFavoriteBooks();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000} // 6 seconds
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>

            <div className="title_other">
                <h1>Other Books</h1>
                <p>Other books you might be interested in.</p>
            </div>
            <div className="other_book">
                <div className="button_back">
                    <i className="fa-solid fa-chevron-left"></i>
                </div>
                <div className="list_other">
                    {items.map((item) => (
                        <div className="items" key={item.id}>
                            <div
                                className="book_item"
                                onClick={() => navigate(`/book/${item.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img src={item.cover_path} alt={item.title} />
                            </div>
                            <div className="descript_item">
                                <h1>{item.title}</h1>
                                <p>{item.description}</p>
                                <div className="price">
                                    <span>
                                        USD {item.price_handbook} - {item.price_ebook}
                                    </span>
                                    <span>{item.views}</span>
                                </div>
                                <div className="buy_item">
                                    <div
                                        className="buy"
                                        onClick={() => handleAddToCart(item.id)}
                                    >
                                        <img src={cart} alt="Buy Now" />
                                        <span>Cart</span>
                                    </div>
                                    <img
                                        src={favoriteBooks[item.id] ? markbookIcon_red : markbookIcon}
                                        alt="Bookmark"
                                        onClick={() =>
                                            favoriteBooks[item.id]
                                                ? deleteFavorite(item.id)
                                                : handleFavorite(item.id)
                                        }
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="button_next">
                    <i className="fa-solid fa-chevron-right"></i>
                </div>
            </div>
        </>
    );
};

export default Other_book;

import { useEffect, useState } from 'react';
import cart from '../../assets/Images/cart.png';
import { useParams } from 'react-router-dom';
import markbookIcon from '../../assets/Images/bookmark.png';
import markbookIcon_red from '../../assets/Images/bookmark_red.png';
import axios_api from '../../API/axios';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
const Category = () => {
    const { id } = useParams(); // Category ID from URL params
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState({ books: [] }); // Initialize with a safe object
    const [error, setError] = useState(null);
    const [favoriteBooks, setFavoriteBooks] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };
    // Fetch category details
    const fetchSubCategoryDetails = async () => {
        try {
            setLoading(true);
            const response = await axios_api.get(`/subcategories/${id}/books`);
            setCategory(response.data.subcategory || { books: [] }); // Ensure category always has a 'books' array
        } catch (err) {
            console.error('Error fetching category details:', err);
            setError('Failed to load category details.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch favorite books
    const fetchFavoriteBooks = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');

            if (!authToken || !userId) return;

            const response = await axios_api.get(`/user/${userId}/favorites`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            const favoriteMap = response.data.favorites.reduce((map, book) => {
                map[book.books_id] = true;
                return map;
            }, {});

            setFavoriteBooks(favoriteMap);
        } catch (error) {
            console.error('Error fetching favorite books:', error);
        }
    };

    // Toggle favorite status
    const handleFavoriteToggle = async (bookId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');

            if (!authToken || !userId) {
                alert('User is not authenticated or user ID is missing.');
                return;
            }

            if (favoriteBooks[bookId]) {
                await axios_api.delete('/favorite', {
                    headers: { Authorization: `Bearer ${authToken}` },
                    data: { books_id: bookId, users_id: userId },
                });
                setSuccessMessage('Removed from favorites successfully!');
            } else {
                await axios_api.post('/favorite', { books_id: bookId, users_id: userId }, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setSuccessMessage('Added to favorites successfully!');
            }

            setFavoriteBooks((prev) => ({ ...prev, [bookId]: !prev[bookId] }));
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error toggling favorite status:', error);
            alert('An error occurred while updating favorites.');
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

            const requestData = {
                book_id: bookId,
                user_id: userId,
                quantity,
            };

            const response = await axios_api.post('/cart', requestData, {
                headers: { Authorization: `Bearer ${authToken}` },
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

    // Fetch category and favorites on component mount or ID change
    useEffect(() => {
        fetchSubCategoryDetails();
        fetchFavoriteBooks();
    }, [id]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) return <LinearProgress />;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" className="Snackbar">
                    {successMessage}
                </Alert>
            </Snackbar>
            <div className="Books">
                <div className="menu_item_name">
                    <h1>{category.category_name} / {category.name}</h1>
                </div>
            </div>

            <div className="related-books">
                <div className="item_books">
                    {category.books && category.books.length > 0 ? (
                        category.books.map((item) => (
                            <div key={item.id} className="items"  onClick={() => handleBookClick(item.id)} style={{ cursor: 'pointer' }}>
                                <div className="book_item">
                                    <img src={item.cover_path} alt={item.title} />
                                </div>
                                <div className="descript_item">
                                    <h1>{item.title}</h1>
                                    <p>{item.description}</p>
                                    <div className="price">
                                        <span>Price: ${item.price_handbook}</span>
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
                                            onClick={() => handleFavoriteToggle(item.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No books available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Category;

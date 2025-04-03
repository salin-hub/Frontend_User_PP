import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/style/ProductView.css';
import { FaStar, FaRegStar } from "react-icons/fa";
// import Mark from '../assets/Images/bookmark.png';
import axios_api from '../API/axios';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import BookReviews from './Comments/BookReview';
const ViewBook = () => {
    const { id } = useParams(); // Book ID from URL params
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [favoriteBooks, setFavoriteBooks] = useState({});
    const navigate = useNavigate();
    // Fetch book details
    const fetchBookDetails = async () => {
        try {
            setLoading(true);
            const response = await axios_api.get(`/book/${id}`);
            setBook(response.data.bookDetails || {});
            setRelatedBooks(response.data.bookDetails.relatedBooks || []);
        } catch (err) {
            console.error('Error fetching book details:', err);
            setError('Failed to load book details.');
        } finally {
            setLoading(false);
        }
    };
    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} color="#FFD700" /> : <FaRegStar key={i} color="#FFD700" />);
        }
        return stars;
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

            const requestData = {
                books_id: bookId,
                users_id: userId,
            };

            const response = await axios_api.post('/favorite', requestData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            alert(response.data.message);
            setFavoriteBooks((prev) => ({ ...prev, [bookId]: true }));
        } catch (error) {
            console.error('Error adding to favorites:', error);
            alert('An error occurred while adding to favorites.');
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

    // Remove a book from favorites
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

            const response = await axios_api.delete('/favorite', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                data: requestData,
            });

            alert(response.data.message);
            setFavoriteBooks((prev) => ({ ...prev, [bookId]: false }));
        } catch (error) {
            console.error('Error deleting favorite:', error);
            alert('An error occurred while removing from favorites.');
        }
    };

    useEffect(() => {
        fetchBookDetails();
    }, [id]);
    const Author_Name = (AuthorID) => {
        navigate(`/author/${AuthorID}`);
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

    // Add book to wishlist
    // const handleAddToWishlist = () => {
    //     if (!book) return;
    //     alert(`Added to Wishlist: ${book.title || 'Unknown'}`);
    // };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    useEffect(() => {
        fetchFavoriteBooks(); // Fetch favorite books when the component mounts
    }, []);
    if (loading) return <LinearProgress />;
    if (error) return <div>{error}</div>;
    if (!book) return <div>No product data available.</div>;

    return (
        <>
            {error && <div>Error: {error}</div>}

            {successMessage && (
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={600} // Auto hide after 6 seconds
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleSnackbarClose} severity="success" className="Snackbar" sx={{

                    }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            )}
            <div className="Books">
                <div className="Name_menu">
                    <h1 style={{ paddingLeft: "20px" }}>{book.book.title || 'Untitled Book'}</h1>
                </div>
            </div>
            <div className="product-view">
                <div className="product-image">
                    <img src={book.book.cover_path} alt={book.book.title} />
                </div>
                <div className="product-details">
                    <h1>{book.book.title || 'Untitled Book'}</h1>
                    <span>
                        <strong>by:</strong>
                        <p
                            onClick={() => Author_Name(book.book.author.id)}
                            style={{
                                cursor: 'pointer',
                                transition: 'color 0.3s ease, text-decoration 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = 'blue';
                                e.target.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '';
                                e.target.style.textDecoration = '';
                            }}
                        >
                            {book.book.author.name || 'Unknown Author'}
                        </p>
                        (Author)
                    </span>
                    <p>Category: {book.book.category.name || 'N/A'}</p>
                    <p>{book.book.description || 'No description available.'}</p>
                    <div className="product-price">
                        <p><strong>Price:</strong> ${book.book.price_handbook}</p>
                    </div>
                    <div className="controll_button">
                        <button onClick={() => handleAddToCart(book.book.id)}>
                            <ShoppingCartIcon style={{ fontSize: '20px' }} />
                        </button>
                        <button
                            onClick={() =>
                                favoriteBooks[book.book.id]
                                    ? deleteFavorite(book.book.id)
                                    : handleFavorite(book.book.id)
                            }
                        >
                            <BookmarkIcon
                                style={{
                                    fontSize: '25px',
                                    color: favoriteBooks[book.book.id] ? 'red' : 'black',
                                }}
                            />
                        </button>
                    </div>
                </div>
            </div>
            <div className="product-extra-details">
                <h2>Book Details</h2>
                <div className="details">
                    <div className="details_1">
                        <div><strong>Publisher:</strong> {book.book?.publisher || 'N/A'}</div>
                        <div><strong>Publish Date:</strong> {book.book?.publish_date || 'N/A'}</div>
                        <div><strong>Author:</strong> {book.book.author.name}</div>
                        <div><strong>Pages:</strong> {book.book?.pages || 'N/A'}</div>
                    </div>
                    <div className="details_2">
                        <div><strong>Dimensions:</strong> {book.book?.dimensions || 'N/A'}</div>
                        <div><strong>Language:</strong> {book.book?.language || 'N/A'}</div>
                        <div><strong>EAN:</strong> {book.book?.ean || 'N/A'}</div>
                        <div><strong>Cetegory:</strong> {book.book.category.name || 'N/A'}</div>
                    </div>
                </div>
            </div>
            <div className="related-books">
                <h2>Related Books</h2>
                <div className="list_other">
                    {relatedBooks.map((item) => (
                        <div className="item" key={item.id} style={{ cursor: 'pointer',position: 'relative' }}>
                             {item.discount_percentage > 0 && (
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        position: 'absolute',
                                        top: '5px',
                                        left: '10px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        padding: '10px',
                                        borderRadius: '50%',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        zIndex: '10',
                                    }}
                                >
                                    {item.discount_percentage}%
                                </div>
                            )}
                            <div
                                className="cover_item"
                                onClick={() => navigate(`/book/${item.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img src={item.cover_path} alt={item.title} />
                            </div>
                            <div className="text_item">
                                <h1>{item.title}</h1>
                                <p>{item.description}</p>
                                <div className="rating">{renderStars(item.averageRating)}</div>
                                <div className="price_item">
                                {item.discounted_price && item.discounted_price < item.oragenal_price? (
                                            <>
                                                <span style={{ textDecoration: "line-through", color: "gray", marginRight: "10px" }}>
                                                    ${item.oragenal_price}
                                                </span>
                                                <span style={{ fontWeight: "bold", color: "red" }}>
                                                    ${item.discounted_price}
                                                </span>
                                            </>
                                        ) : (
                                            <span style={{ fontWeight: "bold" }}>$ {item.oragenal_price}</span>
                                        )}
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
                <BookReviews bookDetails ={book}/>
            </div>
        </>
    );
};

export default ViewBook;

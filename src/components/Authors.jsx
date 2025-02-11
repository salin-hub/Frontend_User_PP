import cart from '../assets/Images/cart.png';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import axios_api from '../API/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import markbookIcon_red from '../assets/Images/bookmark_red.png';
import markbookIcon from '../assets/Images/bookmark.png';
import '../assets/style/description.css';
import { useNavigate } from 'react-router-dom';
const Authors = () => {
    const { id } = useParams(); // Author ID from URL params
    const [loading, setLoading] = useState(true);
    const [author, setAuthor] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const [favoriteBooks, setFavoriteBooks] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };
    // Fetch author details and books by page
    const fetchAuthorDetails = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios_api.get(`/spasific_author/${id}?page=${page}`);
            setAuthor(response.data.author || {});
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error('Error fetching author details:', err);
            setError('Failed to load author details.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user favorite books
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
            console.error('Error fetching favorites:', error);
        }
    };

    // Toggle favorite status
    const toggleFavorite = async (bookId) => {
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
            console.error('Error toggling favorite:', error);
            alert('An error occurred while updating favorites.');
        }
    };

    // Add book to cart
    const handleAddToCart = async (bookId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userID');

            if (!authToken || !userId) {
                alert('User is not authenticated or user ID is missing.');
                return;
            }

            const response = await axios_api.post('/cart', {
                book_id: bookId,
                user_id: userId,
                quantity: 1,
            }, {
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
            alert('An error occurred while adding to the cart.');
        }
    };

    useEffect(() => {
        fetchAuthorDetails(currentPage);
        fetchFavoriteBooks();
    }, [id, currentPage]);

    const handleSnackbarClose = () => setSnackbarOpen(false);

    if (loading) return (
        <>
            <LinearProgress />
            <div style={{ height: "500px" }}>

            </div>
        </>);
    if (error) return <div>{error}</div>;
    if (!author) return <div>No author found</div>;

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>

            <div className="Books">
                <div className="Name_menu">
                    <h1>{author.name}</h1>
                </div>
            </div>

            <div className="detailAuthor">
                <div className="imageController">
                    <img src={author.image} alt="Author" />
                </div>
                <div className="description">
                    <h1>Information:</h1>
                    <p>{author.description}</p>
                </div>
            </div>

            <div className="Books">
                <div className="Name_menu">
                    <h1>Book Collection</h1>
                </div>
            </div>

            <div className="template_book">
                {author.books && author.books.map((book) => (
                    <div className="items" key={book.id} onClick={() => handleBookClick(book.id)} style={{ cursor: 'pointer' }}>
                        <div className="book_item">
                            <img src={book.cover_path} alt={book.title} />
                        </div>
                        <div className="descript_item">
                            <h1>{book.title}</h1>
                            <p>{book.description}</p>
                            <div className="price">
                                <span>USD {book.price_handbook}</span>

                            </div>
                            <div className="buy_item">
                                <div
                                    className="buy"
                                    onClick={() => handleAddToCart(book.id)}
                                >
                                    <img src={cart} alt="Cart" />
                                    <span>Cart</span>
                                </div>
                                <img
                                    src={favoriteBooks[book.id] ? markbookIcon_red : markbookIcon}
                                    alt="Bookmark"
                                    onClick={() => toggleFavorite(book.id)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination-container">
                <button
                    className="pagination-arrow"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <IoIosArrowBack />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`pagination-page ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="pagination-arrow"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    <IoIosArrowForward />
                </button>
            </div>
        </>
    );
};

export default Authors;

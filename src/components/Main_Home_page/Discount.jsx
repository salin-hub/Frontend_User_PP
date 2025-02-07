import '../../assets/style/Books.css';
import cart from '../../assets/Images/cart.png';
import markbookIcon_red from '../../assets/Images/bookmark_red.png';
import markbookIcon from '../../assets/Images/bookmark.png';
import axios_api from '../../API/axios';
import { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const NewBook = () => {
    const [newBook, setNewBook] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('default');
    const [favoriteBooks, setFavoriteBooks] = useState({});

    const fetchNewBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios_api.get("books/new");
            setNewBook(response.data.data);
        } catch (error) {
            console.error("Error fetching new books:", error);
            setError("Failed to fetch books. Please try again later.");
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
                headers: { 'Authorization': `Bearer ${authToken}` },
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

    const handleFavoriteToggle = async (bookId, event) => {
        event.stopPropagation();
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

    const handleAddToCart = async (bookId, event) => {
        event.stopPropagation(); // Prevent the book item click event
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

    const handleSortChange = (e) => {
        const order = e.target.value;
        setSortOrder(order);

        let sortedBooks = [...newBook];

        switch (order) {
            case 'asc':
                sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'desc':
                sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'year-asc':
                sortedBooks.sort((a, b) => new Date(a.publish_date) - new Date(b.publish_date));
                break;
            case 'year-desc':
                sortedBooks.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
                break;
            case 'price-asc':
                sortedBooks.sort((a, b) => (parseFloat(a.price_handbook) || 0) - (parseFloat(b.price_handbook) || 0));
                break;
            case 'price-desc':
                sortedBooks.sort((a, b) => (parseFloat(b.price_handbook) || 0) - (parseFloat(a.price_handbook) || 0));
                break;
            default:
                fetchNewBooks();
                return;
        }

        setNewBook(sortedBooks);
    };

    const filteredBooks = newBook.filter(book => book.title); // Apply any other filters if needed.

    useEffect(() => {
        fetchNewBooks();
        fetchFavoriteBooks();
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            {error && <div>Error: {error}</div>}

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

            {loading && <LinearProgress sx={{ marginBottom: '20px' }} />}

            <div className="name_menu">
                <h1>Discount Books</h1>
            </div>
            <div className="sortItems" style={{margin:"30px"}}>
                <select className="sortDropdowns" value={sortOrder} onChange={handleSortChange}>
                    <option value="default">Default</option>
                    <option value="asc">Title A-Z</option>
                    <option value="desc">Title Z-A</option>
                    <option value="year-asc">Oldest Year</option>
                    <option value="year-desc">Newest Year</option>
                    <option value="price-asc">Price Low to High</option>
                    <option value="price-desc">Price High to Low</option>
                </select>
            </div>

            <div className="Books_item">

                <div className="template_books">
                    {filteredBooks.length === 0 ? (
                        <div>No books found for your selected filters.</div>
                    ) : (
                        filteredBooks.map((book) => {
                            // Static discount of 20%
                            const discountPercentage = 20;
                            const originalPrice = parseFloat(book.price_handbook) || 0;
                            const discountedPrice = originalPrice * (1 - discountPercentage / 100);
                        
                            return (
                                <div className="items" key={book.id} style={{ cursor: 'pointer',position: 'relative' }}>
                                    <div 
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                left: '10px',
                                                backgroundColor: 'red',
                                                color: 'white',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                zIndex: '10',
                                            }}
                                        >
                                            {discountPercentage}% OFF
                                        </div>
                                    <div className="book_item">
            
                        
                                        <img src={book.cover_path || 'fallback_image_url'} alt={book.title} />
                                    </div>
                                    <div className="descript_item">
                                        <h1>{book.title}</h1>
                                        <p>{book.description || "No description available."}</p>
                                        <div className="price">
                                            
                                            <span style={{ textDecoration: 'line-through', marginRight: '10px' }}>
                                                USD {originalPrice.toFixed(2)}
                                            </span>
                                            <span>
                                                USD {discountedPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="descript_item">
                                            <div className="buy_item">
                                                <div className="buy" onClick={(event) => handleAddToCart(book.id, event)}>
                                                    <img src={cart} alt="cart" />
                                                    <span>Cart</span>
                                                </div>
                                                <img
                                                    src={favoriteBooks[book.id] ? markbookIcon_red : markbookIcon}
                                                    alt="Bookmark"
                                                    onClick={(event) => handleFavoriteToggle(book.id, event)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        

                        
                    )}
                </div>
            </div>
        </>
    );
};

export default NewBook;

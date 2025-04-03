import '../../assets/style/Books.css';
import cart from '../../assets/Images/cart.png';
// import markbookIcon_red from '../../assets/Images/bookmark_red.png';
// import markbookIcon from '../../assets/Images/bookmark.png';
import axios_api from '../../API/axios';
import { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FaStar, FaRegStar } from "react-icons/fa";
const NewBook = () => {
    const [discount, setDiscount] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('default');
    // const [favoriteBooks, setFavoriteBooks] = useState({});

    const fetchNewBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios_api.get("/getBookDiscounts");
            setDiscount(response.data.Discounts);
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

            // const response = await axios_api.get(`/user/${userId}/favorites`, {
            //     headers: { 'Authorization': `Bearer ${authToken}` },
            // });

            // const favoriteMap = response.data.favorites.reduce((map, book) => {
            //     map[book.books_id] = true;
            //     return map;
            // }, {});

            // setFavoriteBooks(favoriteMap);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    // const handleFavoriteToggle = async (bookId, event) => {
    //     event.stopPropagation();
    //     try {
    //         const authToken = localStorage.getItem('authToken');
    //         const userId = localStorage.getItem('userID');

    //         if (!authToken || !userId) {
    //             alert('User is not authenticated or user ID is missing.');
    //             return;
    //         }

    //         if (favoriteBooks[bookId]) {
    //             await axios_api.delete('/favorite', {
    //                 headers: { Authorization: `Bearer ${authToken}` },
    //                 data: { books_id: bookId, users_id: userId },
    //             });
    //             setSuccessMessage('Removed from favorites successfully!');
    //         } else {
    //             await axios_api.post('/favorite', { books_id: bookId, users_id: userId }, {
    //                 headers: { Authorization: `Bearer ${authToken}` },
    //             });
    //             setSuccessMessage('Added to favorites successfully!');
    //         }

    //         setFavoriteBooks((prev) => ({ ...prev, [bookId]: !prev[bookId] }));
    //         setSnackbarOpen(true);
    //     } catch (error) {
    //         console.error('Error toggling favorite:', error);
    //         alert('An error occurred while updating favorites.');
    //     }
    // };

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

        let sortedBooks = [...discount];

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

        setDiscount(sortedBooks);
    };
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} color="#FFD700" /> : <FaRegStar key={i} color="#FFD700" />);
        }
        return stars;
    };
    // const filteredBooks = discount .filter(book => book.title); // Apply any other filters if needed.

    useEffect(() => {
        fetchNewBooks();
        fetchFavoriteBooks();
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    if (loading) return (
        <><LinearProgress />
            <div style={{ height: "500px" }}>

            </div>
        </>

    );
    if (error) return <p>Error: {error}</p>;

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
            <div className="sortItems" style={{ margin: "30px" }}>
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

            <div className="Books_item" style={{"paddingLeft":"30px"}}>
                <div className="item_books" style={{ "padding": "20px" }}>
                    {discount.map((book, index) => (
                        <div className="items" key={index} style={{ cursor: 'pointer', position: 'relative' }}>
                            {/* Display discount label only if there's a discount */}
                            {book.discount_percentage > 0 && (
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
                                    {book.discount_percentage}% OFF
                                </div>
                            )}

                            <div style={{ cursor: 'pointer' }}>
                                <div className="book_item">
                                    <img src={book.book_image} alt={book.book_title} />
                                </div>
                                <div className="descript_item">
                                    <h1>{book.book_title}</h1>
                                    <p>{book.book_description}</p>
                                    <div className="rating">{renderStars(book.rating)}</div>

                                    <div className="price">
                                        {/* Check if there's a discount and display prices accordingly */}
                                        {book.discounted_price && book.discounted_price < book.original_price ? (
                                            <>
                                                <span style={{ textDecoration: "line-through", color: "gray", marginRight: "10px" }}>
                                                    USD {book.original_price}
                                                </span>
                                                <span style={{ fontWeight: "bold", color: "red" }}>
                                                    USD {book.discounted_price}
                                                </span>
                                            </>
                                        ) : (
                                            <span style={{ fontWeight: "bold" }}>USD {book.original_price}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="descript_item">
                                <div className="buy_item">
                                    {/* Add to Cart Button */}
                                    <div className="buy" onClick={() => handleAddToCart(book.id)}>
                                        <img src={cart} alt="cart" />
                                        <span>Cart</span>
                                    </div>

                                    {/* Bookmark Button */}
                                    {/* <img
                                        src={favoriteBooks[book.id] ? markbookIcon_red : markbookIcon}
                                        alt="bookmark"
                                        onClick={() =>
                                            favoriteBooks[book.id]
                                                ? deleteFavorite(book.id)  // Remove from favorites
                                                : handleFavorite(book.id)  // Add to favorites
                                        }
                                    /> */}
                                </div>
                            </div>
                        </div>
                    ))}



                    {/* <div className="pagination-container">
                        <button
                            className="pagination-arrow"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <IoIosArrowBack />
                        </button>
                        {[...Array(totalPages).keys()].map((page) => (
                            <button
                                key={page + 1}
                                className={`pagination-page ${currentPage === page + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                {page + 1}
                            </button>
                        ))}
                        <button
                            className="pagination-arrow"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <IoIosArrowForward />
                        </button>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default NewBook;

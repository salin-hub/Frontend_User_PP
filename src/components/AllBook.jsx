import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/style/sortItem.css';
import cart from '../assets/Images/cart.png';
import Other_book from './Other_book';
import Discount_custom from './Main_Home_page/Discount_custom';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import LinearProgress from '@mui/material/LinearProgress';
import axios_api from '../API/axios';
import markbookIcon from '../assets/Images/bookmark.png';
import markbookIcon_red from '../assets/Images/bookmark_red.png';
import Motion from './Motion';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FaStar, FaRegStar } from "react-icons/fa";
import { useCart } from '../components/Contexts/CartContext';
import { useFavorite } from './Contexts/FavoriteContext';
const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [authors, setAuthors] = useState([]);
    const [favoriteBooks, setFavoriteBooks] = useState({});
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState('');
    const [originalBooks, setOriginalBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const { handleAddToCart } = useCart();
    const { handleFavorite, deleteFavorite, fetchFavoriteBooks } = useFavorite();

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const visibleBooks = books.slice(startIndex, endIndex);
    const totalPages = Math.ceil(books.length / booksPerPage);
    // Handle page navigation
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Fetch the list of books
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await axios_api.get('/books');
            setBooks(response.data.books);
            setOriginalBooks(response.data.books);
            console.log(response.data.books);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} color="#FFD700" /> : <FaRegStar key={i} color="#FFD700" />);
        }
        return stars;
    };

    // Fetch authors data
    // const fetchAuthors = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios_api.get('getauthors');
    //         setAuthors(response.data.authors);
    //     } catch (err) {
    //         setError(err.response ? err.response.data.message : 'An error occurred while fetching authors');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSortChange = (e) => {
        const order = e.target.value;
        setSortOrder(order);

        if (order === 'default') {
            setBooks([...originalBooks]); // Reset to the original order
            return;
        }

        let sortedBooks = [...books]; // Start with the current list of books

        switch (order) {
            case 'asc':
                sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
                console.log(sortedBooks.sort((a, b) => a.title.localeCompare(b.title)));
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
                sortedBooks.sort((a, b) => a.price_handbook - b.price_handbook);
                break;
            case 'price-desc':
                sortedBooks.sort((a, b) => b.price_handbook - a.price_handbook);
                break;

        }

        setBooks(sortedBooks); // Update the books state with the sorted list
    };


    // Add a book to favorites
    // const handleFavorite = async (bookId) => {
    //     try {
    //         const authToken = localStorage.getItem('authToken');
    //         const userId = localStorage.getItem('userID');

    //         if (!authToken || !userId) {
    //             alert('User is not authenticated or user ID is missing.');
    //             return;
    //         }

    //         const requestData = {
    //             books_id: bookId,
    //             users_id: userId,
    //         };

    //         await axios_api.post('/favorite', requestData, {
    //             headers: {
    //                 'Authorization': `Bearer ${authToken}`,
    //             },
    //         });
    //         setSuccessMessage('Book favorite successfully!');
    //         setFavoriteBooks((prev) => ({ ...prev, [bookId]: true }));
    //     } catch (error) {
    //         console.error('Error adding to favorites:', error);
    //         alert('An error occurred while adding to favorites.');
    //     }
    // };
    // Fetch the user's favorite books
    // const fetchFavoriteBooks = async () => {
    //     try {
    //         const authToken = localStorage.getItem('authToken');
    //         const userId = localStorage.getItem('userID');
    //         if (!authToken || !userId) return;

    //         const response = await axios_api.get(`/user/${userId}/favorites`, {
    //             headers: {
    //                 'Authorization': `Bearer ${authToken}`,
    //             },
    //         });

    //         const favorites = response.data.favorites;
    //         const favoriteMap = favorites.reduce((map, book) => {
    //             map[book.books_id] = true;
    //             return map;
    //         }, {});
    //         setFavoriteBooks(favoriteMap);
    //     } catch (error) {
    //         console.error('Error fetching favorites:', error);
    //     }
    // };

    // // Remove a book from favorites
    // const deleteFavorite = async (bookId) => {
    //     try {
    //         const authToken = localStorage.getItem('authToken');
    //         const userId = localStorage.getItem('userID');

    //         if (!authToken || !userId) {
    //             alert('User is not authenticated or user ID is missing.');
    //             return;
    //         }

    //         const requestData = {
    //             books_id: bookId,
    //             users_id: userId,
    //         };

    //         await axios_api.delete('/favorite', {
    //             headers: {
    //                 'Authorization': `Bearer ${authToken}`,
    //             },
    //             data: requestData,
    //         });

    //         // alert(response.data.message);
    //         setFavoriteBooks((prev) => ({ ...prev, [bookId]: false }));
    //     } catch (error) {
    //         console.error('Error deleting favorite:', error);
    //         alert('An error occurred while removing from favorites.');
    //     }
    // };

    // Handle book click navigation
    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    // Handle author click navigation
    // const handleauthorClick = (Author_id) => {
    //     navigate(`/author/${Author_id}`);
    // };

    // // Add a book to the cart
    // const handleAddToCart = async (bookId) => {
    //     try {
    //         const authToken = localStorage.getItem('authToken');
    //         const userId = localStorage.getItem('userID');
    //         const quantity = 1;

    //         if (!authToken || !userId) {
    //             // Redirect to the login page
    //             navigate('/login');
    //             return;
    //         }

    //         // Prepare the request data
    //         const requestData = {
    //             book_id: bookId,
    //             user_id: userId,
    //             quantity: quantity,
    //         };
    //         console.log(bookId)

    //         // Send the POST request to add the book to the cart
    //         const response = await axios_api.post('/cart', requestData, {
    //             headers: {
    //                 'Authorization': `Bearer ${authToken}`,
    //             },
    //         });

    //         // Check the response status
    //         if (response.status === 200) {
    //             setSuccessMessage('Book added to cart successfully!');
    //             setSnackbarOpen(true);
    //         } else {
    //             alert('Failed to add book to cart. Please try again.');
    //         }
    //     } catch (error) {
    //         console.error('Error adding to cart:', error);

    //         // Check if the error is from the server
    //         if (error.response) {
    //             // Server returned a response with an error status
    //             alert(`Error: ${error.response.data.message || 'An error occurred while adding to the cart.'}`);
    //         } else if (error.request) {
    //             // No response from server (Network issues)
    //             alert('Network error. Please check your internet connection and try again.');
    //         } else {
    //             // Something else happened
    //             alert('An unexpected error occurred. Please try again.');
    //         }
    //     }
    // };



    useEffect(() => {
        fetchBooks();
        fetchFavoriteBooks();
    }, []);



    if (loading) return <LinearProgress />;
    if (error) return <p>Error: {error}</p>;
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    return (
        <>
            {error && <div>Error: {error}</div>}

            {successMessage && (
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
            )}

            <div className="sortItem">
                <h1>All Books</h1>
                <select className="sortDropdown" value={sortOrder} onChange={handleSortChange}>
                    <option value="default">Default</option>
                    <option value="asc">Title A-Z</option>
                    <option value="desc">Title Z-A</option>
                    <option value="year-asc">Oldest Year</option>
                    <option value="year-desc">Newest Year</option>
                    <option value="price-asc">Price Low to High</option>
                    <option value="price-desc">Price High to Low</option>
                </select>
            </div>

            {/* <div className="item_authors">
                    <div className="seeMores">
                        <h1>EDITOR’S CHOICE</h1>
                        <div className="seeall">
                            <p>See All</p>
                            <i className="fa-solid fa-caret-down"></i>
                        </div>
                    </div>

                    {authors.map((author) => (
                        <div key={author.id} onClick={() => handleauthorClick(author.id)} style={{ cursor: 'pointer' }}>
                            <li>
                                <h2>{author.name}</h2>
                                <p>{author.description}</p>
                            </li>
                        </div>
                    ))}
                </div> */}
                <div className="item_books">
                    {visibleBooks.map((book) => (
                        <div className="items" key={book.id} style={{ cursor: 'pointer', position: 'relative' }}>
                            {/* Display discount label only if there's a discount */}
                            {book.discount && book.discount.discount_percentage > 0 && (
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
                                    {book.discount.discount_percentage}% OFF
                                </div>
                            )}

                            <div onClick={() => handleBookClick(book.id)} style={{ cursor: 'pointer' }}>
                                <div className="book_item">
                                    <img src={book.cover_path} alt={book.title} />
                                </div>
                                <div className="descript_item">
                                    <h1>{book.title}</h1>
                                    <p>{book.description}</p>
                                    <div className="rating">
                                        {renderStars(book.ratingCount)} |
                                        {book.reviewcount > 1
                                            ? `${book.reviewcount} Reviews`
                                            : book.reviewcount === 1
                                                ? `${book.reviewcount} Review`
                                                : " Review"
                                        }
                                    </div>


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
                                    <img
                                        src={favoriteBooks[book.id] ? markbookIcon_red : markbookIcon}
                                        alt="bookmark"
                                        onClick={() =>
                                            favoriteBooks[book.id]
                                                ? deleteFavorite(book.id)  // Remove from favorites
                                                : handleFavorite(book.id)  // Add to favorites
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}



                    <div className="pagination-container">
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
                    </div>
                </div>
            <Motion />
            <Other_book />
            <Discount_custom/>
        </>
    );
};

export default Books;

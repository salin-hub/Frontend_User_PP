import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios_api from '../../API/axios';
import LinearProgress from '@mui/material/LinearProgress';
import markbookIcon from '../../assets/Images/bookmark.png';
import markbookIcon_red from '../../assets/Images/bookmark_red.png';
import cart from '../../assets/Images/cart.png';
// import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('term') || '';
    const category = queryParams.get('category') || 'All';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favoriteBooks, setFavoriteBooks] = useState({});
    // const [pagination, setPagination] = useState({
    //     currentPage: 1,
    //     totalPages: 1,
    // });

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await axios_api.get(
                    `/books/search?title=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`
                );
                setResults(response.data.books || []);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('No results found for the given search criteria.');
                } else {
                    setError('An error occurred while fetching the search results.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchTerm, category]);

    useEffect(() => {
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

        fetchFavoriteBooks();
    }, []);

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
            setFavoriteBooks(prev => ({ ...prev, [bookId]: true }));
        } catch (error) {
            console.error('Error adding to favorites:', error);
            alert('An error occurred while adding to favorites.');
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

            const response = await axios_api.delete('/favorite', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                data: requestData,
            });

            alert(response.data.message);
            setFavoriteBooks(prev => ({ ...prev, [bookId]: false }));
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

            alert(response.data.message);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred while adding to the cart.');
        }
    };

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    if (loading) return <LinearProgress />;
    if (error) return <p>Error: {error}</p>;

    // const handlePagination = (direction) => {
    //     setPagination(prev => ({
    //         ...prev,
    //         currentPage: direction === 'next' ? prev.currentPage + 1 : prev.currentPage - 1,
    //     }));
    // };

    return (
        <>
            <div className="Books">
                <div className="Name_menu">
                    <h1>Results for {searchTerm} in category {category}.</h1>
                </div>
            </div>

            <div className="search-results">
    {results.length > 0 ? (
        <div className="template_book" style={{ padding: "20px" }}>
            {results.map((book) => (
                <div className="items" key={book.id}>
                    <div onClick={() => handleBookClick(book.id)} style={{ cursor: 'pointer' }}>
                        <div className="book_item">
                            <img src={book.cover_path} alt={book.title} />
                        </div>
                        <div className="descript_item">
                            <h1>{book.title}</h1>
                            <p>{book.description}</p>
                            <div className="price">
                                <span>USD {book.price_handbook} - {book.price_ebook}</span>
                                <span>{book.views}</span>
                            </div>
                        </div>
                    </div>

                    <div className="descript_item">
                        <div className="buy_item">
                            <div className="buy" onClick={() => handleAddToCart(book.id)}>
                                <img src={cart} alt="cart" />
                                <span>Buy Now</span>
                            </div>
                            <img
                                src={favoriteBooks[book.id] ? markbookIcon_red : markbookIcon}
                                alt="bookmark"
                                onClick={() => favoriteBooks[book.id] ? deleteFavorite(book.id) : handleFavorite(book.id)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* <div className="pagination-container">
                <button className="pagination-arrow" disabled={pagination.currentPage === 1} onClick={() => handlePagination('prev')}>
                    <IoIosArrowBack />
                </button>
                <button className="pagination-page">{pagination.currentPage}</button>
                <button className="pagination-arrow" disabled={pagination.currentPage === pagination.totalPages} onClick={() => handlePagination('next')}>
                    <IoIosArrowForward />
                </button>
            </div> */}
        </div>
    ) : (
        <p style={{textAlign:"center", height:"300px"}}>No results found.</p> // This is where the message will appear if no books are found
    )}
</div>

        </>
    );
};

export default SearchResults;

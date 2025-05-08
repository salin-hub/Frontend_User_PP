import { useState, useEffect } from 'react';
import '../assets/style/Wishlist.css';
import cart from '../assets/Images/cart.png';
import Delete from '../assets/Images/Delete.png';
import axios_api from '../API/axios';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar } from "react-icons/fa";

const Wishlist = () => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const userID = localStorage.getItem('userID');
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();

    const items_favorite = async (userID) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios_api.get(`/favorites/${userID}`);
            setItems(response.data.favorites);
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError('Failed to load favorites. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const deleteFavorite = async (bookId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken || !userID) {
                alert('User is not authenticated or user ID is missing.');
                return;
            }

            const requestData = {
                books_id: bookId,
                users_id: userID,
            };

            const response = await axios_api.delete('/favorite', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                data: requestData,
            });

            alert(response.data.message);

            setItems((prevItems) => prevItems.filter((item) => item.book.id !== bookId));
            setSelectedItems((prev) => prev.filter((id) => id !== bookId));
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

    const handleSelect = (bookId) => {
        setSelectedItems((prev) =>
            prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            const allIds = items.map(item => item.id);
            setSelectedItems(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleDeleteSelected = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken || !userID) {
                alert('User not authenticated');
                return;
            }

            for (let id of selectedItems) {
                await axios_api.delete('/favorite', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                    data: {
                        books_id: id,
                        users_id: userID,
                    },
                });
            }

            alert('Selected favorites removed!');
            setItems((prev) => prev.filter(item => !selectedItems.includes(item.id)));
            setSelectedItems([]);
            setSelectAll(false);
        } catch (error) {
            console.error('Error deleting selected items:', error);
            alert('Error while deleting selected items.');
        }
    };

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (userID) {
            items_favorite(userID);
        }
    }, [userID]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} color="#FFD700" /> : <FaRegStar key={i} color="#FFD700" />);
        }
        return stars;
    };
    

    return (
        <>
            {error && <div>Error: {error}</div>}

            {successMessage && (
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
            )}

            <div className="Books">
                <div className="Name_menu">
                    <h1>Wishlist Book</h1>
                </div>
            </div>

            {loading && <LinearProgress sx={{ marginBottom: '20px' }} />}



                {items.length === 0 && !loading && !error && (
                    <div className="empty-wishlist">
                        <h2>Your wishlist is empty!</h2>
                        <p>Browse books and add them to your wishlist.</p>
                    </div>
                )}
                <div className="item_books">
                    {items.map((item, index) => (
                        
                        <div key={index} className="item_wishlist" style={{ position: 'relative' }}>
                            
                            {item.discount && item.discount.discount_percentage > 0 && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '30px',
                                        height: '30px',
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        padding: '5px',
                                        borderRadius: '50%',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        zIndex: '10',
                                        boxShadow: '0 0 5px red'
                                    }}
                                >
                                    {item.discount.discount_percentage}%
                                </div>
                            )}
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    handleSelect(item.id);
                                }}
                                className="wishlist-checkbox"
                                style={{ position: 'absolute', top: 10, right: 20 }}
                            />
                            <div className="book_item_wishlist" onClick={() => handleBookClick(item.id)} style={{ cursor: 'pointer' }}>
                                <img
                                    src={item.cover_path}
                                    alt={item.title}
                                />
                            </div>
                            <div className="descript_item_wishlist">
                                <h1 onClick={() => handleBookClick(item.id)} style={{ cursor: 'pointer' }}>{item.title}</h1>
                                <p>{item.description}</p>
                                <div className="ratingw">
                                    {renderStars(item.ratingCount)} |
                                    {item.reviewcount > 1
                                        ? `${item.reviewcount} Reviews`
                                        : item.reviewcount === 1
                                            ? `${item.reviewcount} Review`
                                            : " Review"
                                    }
                                </div>
                                <div className="price_wishlist">
                                    {/* Check if there's a discount and display prices accordingly */}
                                    {item.discounted_price && item.discounted_price < item.original_price ? (
                                        <>
                                            <span style={{ textDecoration: "line-through", color: "gray", marginRight: "10px" }}>
                                                $ {item.original_price}
                                            </span>
                                            <span style={{ fontWeight: "bold", color: "red" }}>
                                                $ {item.discounted_price}
                                            </span>
                                        </>
                                    ) : (
                                        <span style={{ fontWeight: "bold" }}>$ {item.original_price}</span>
                                    )}

                                </div>
                                <h1>Author: {item.author.name}</h1>
                            </div>

                            <div className="buy_item">
                                <div className="buy" onClick={() => handleAddToCart(item.id)}>
                                    <img src={cart} alt="Cart" />
                                    <span>Cart</span>
                                </div>
                                <img
                                    src={Delete}
                                    alt="Delete"
                                    onClick={() => deleteFavorite(item.id)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <div>{item.create_at}</div>
                          
                        </div>
                    ))}
                    {items.length > 0 && (
                        <div className="wishlist-header">
                            <label>
                                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                                <h1>Select All</h1>
                            </label>
                            <button onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                                Delete
                            </button>
                            <button  disabled={selectedItems.length === 0}>
                                Add Cart
                            </button>
                        </div>
                    )}

                </div>
            
        </>
    );
};

export default Wishlist;

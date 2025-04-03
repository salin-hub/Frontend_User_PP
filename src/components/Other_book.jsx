import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios_api from '../API/axios';
import Snackbar from '@mui/material/Snackbar';
import { FaStar, FaRegStar } from "react-icons/fa";
const Other_book = () => {
    const [items, setItems] = useState([]); // Store most favorited books
  
    const [loading, setLoading] = useState(true); // Add loading state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    const items_favorite = async () => {
        try {
            const response = await axios_api.get('/bestsellers');
            setItems(response.data.bestsellers);
        } catch (err) {
            console.error('Error fetching favorites:', err);
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


    
    // Snackbar close handler
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Fetch data on mount
    useEffect(() => {
        items_favorite();
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
            </Snackbar>

            <div className="Name_menu">
                <h1>Best Sellers</h1>
                <p style={{ fontSize: "18px", color: "#666", marginTop: "10px" }}>
                Discover the Most Popular Books Loved by Readers Worldwide!
                </p>
            </div>
            <div className="other_book">
                <div className="button_back">
                    <i className="fa-solid fa-chevron-left"></i>
                </div>
                <div className="list_other">
                    {items.map((item) => (
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
                                <div className="rating">{renderStars(item.rating)}</div>
                                <div className="price_item">
                                {item.discounted_price && item.discounted_price < item.price_handbook? (
                                            <>
                                                <span style={{ textDecoration: "line-through", color: "gray", marginRight: "10px" }}>
                                                    ${item.price_handbook}
                                                </span>
                                                <span style={{ fontWeight: "bold", color: "red" }}>
                                                    ${item.discounted_price}
                                                </span>
                                            </>
                                        ) : (
                                            <span style={{ fontWeight: "bold" }}>USD {item.price_handbook}</span>
                                        )}
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

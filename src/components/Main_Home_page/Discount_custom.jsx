import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios_api from '../../API/axios';
import Snackbar from '@mui/material/Snackbar';
import { FaStar, FaRegStar } from "react-icons/fa";

const OtherBook = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios_api.get('/getBookDiscounts');
                setItems(response.data.Discounts);
            } catch (err) {
                console.error('Error fetching favorites:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} color="#FFD700" /> : <FaRegStar key={i} color="#FFD700" />);
        }
        return stars;
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const renderBookList = (title, discountThreshold, caption) => (
        <div>
            <div className="Name_menu">
                <h1>{title}</h1>
                <p style={{ fontSize: "18px", color: "#666", marginTop: "10px" }}>{caption}
                </p>
            </div>
            <div className="other_book">
                <div className="button_back">
                    <i className="fa-solid fa-chevron-left"></i>
                </div>
                <div className="list_other">
                    {items.filter(item => item.discount_percentage >= discountThreshold).map((item) => (
                        <div className="item" key={item.id} style={{ cursor: 'pointer', position: 'relative' }}>
                            {item.discount_percentage > 0 && (
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        position: 'absolute',
                                        top: '5px',
                                        left: '10px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        padding: '5px',
                                        borderRadius: '50%',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        zIndex: '10',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {item.discount_percentage}%
                                </div>
                            )}
                            <div
                                className="cover_item"
                                onClick={() => navigate(`/book/${item.book_id}`)}
                            >
                                <img src={item.book_image} alt={item.book_title} />
                            </div>
                            <div className="text_item">
                                <h1>{item.book_title}</h1>
                                <p>{item.book_description}</p>
                                <div className="rating">{renderStars(item.book_rating)}</div>
                                <div className="price_item">
                                    {item.discounted_price && item.discounted_price < item.original_price ? (
                                        <>
                                            <span style={{ textDecoration: "line-through", color: "gray", marginRight: "10px" }}>
                                                ${item.original_price}
                                            </span>
                                            <span style={{ fontWeight: "bold", color: "red" }}>
                                                ${item.discounted_price}
                                            </span>
                                        </>
                                    ) : (
                                        <span style={{ fontWeight: "bold" }}>$ {item.original_price}</span>
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
        </div>
    );

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            />
            {renderBookList("Minimum 40% Discount", 40, "Grab the hottest reads at unbeatable prices! Save up to 40% on bestsellers")}
            {renderBookList("Up to 45% Discount", 45, "Enjoy incredible savings with up to 45% off on the most beloved books! Do not miss out on these reader-favorite deals! ")}
        </>
    );
};

export default OtherBook;